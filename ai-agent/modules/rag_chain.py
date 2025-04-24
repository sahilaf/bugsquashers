import os
from typing import List
from dotenv import load_dotenv
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from pymongo import MongoClient
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate
)

# Load environment variables from .env file
load_dotenv()

# Environment variable validation
required_vars = ["MONGO_URI", "MONGO_DB_NAME", "GEMINI_API_KEY"]
missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")
COLLECTION_NAMES = [name.strip() for name in os.getenv("MONGO_COLLECTIONS", "").split(",") if name.strip()]

# Support guidelines configuration
GUIDELINES_FILE = os.getenv("SUPPORT_GUIDELINES_FILE", "support_guidelines.txt")

# Diagnostic print for file location
print(f"Current working directory: {os.getcwd()}")
print(f"Looking for guidelines at: {os.path.abspath(GUIDELINES_FILE)}")
print(f"File exists: {os.path.exists(GUIDELINES_FILE)}")

def load_support_guidelines() -> str:
    """Load support guidelines from text file with error handling."""
    try:
        with open(GUIDELINES_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        raise FileNotFoundError(
            f"Support guidelines file not found at {GUIDELINES_FILE}. "
            "Create the file or check the SUPPORT_GUIDELINES_FILE environment variable."
        )
    except Exception as e:
        raise RuntimeError(f"Error reading guidelines file: {str(e)}")

def load_documents_from_mongo() -> List[Document]:
    """Load documents from MongoDB with proper resource management."""
    documents = []
    try:
        with MongoClient(MONGO_URI) as client:
            db = client[DB_NAME]
            
            if not COLLECTION_NAMES:
                raise ValueError("No MongoDB collections specified in environment variables")
                
            for collection_name in COLLECTION_NAMES:
                if collection_name not in db.list_collection_names():
                    raise ValueError(f"Collection '{collection_name}' not found in database")
                
                collection = db[collection_name]
                for record in collection.find():
                    record['_id'] = str(record['_id'])
                    content = "\n".join(
                        f"{key}: {value}" for key, value in record.items()
                    )
                    metadata = {
                        "mongo_id": record['_id'],
                        "collection": collection_name,
                        "source": "mongodb"
                    }
                    documents.append(Document(page_content=content, metadata=metadata))
    except Exception as e:
        raise RuntimeError(f"Failed to load documents from MongoDB: {str(e)}")
    
    return documents

def get_rag_qa_chain():
    """Create RAG QA chain with latest package structure."""
    # Document processing
    docs = load_documents_from_mongo()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", "! ", "? ", ", ", " "]
    )
    chunks = splitter.split_documents(docs)

    # Embeddings and vector store
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        task_type="retrieval_document",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="chroma_store",
        collection_metadata={"hnsw:space": "cosine"}
    )

    # Retriever configuration
    retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 5, "fetch_k": 10}
    )

    # Prompt engineering
    guidelines = load_support_guidelines()
    system_template = f"""You are FairBasket's Expert Support Assistant. Follow these guidelines:
    {guidelines}
    
    Context: {{context}}
    
    Your responsibilities:
    1. Answer only questions related to FairBasket platform
    2. Use only the provided context from MongoDB
    3. For unavailable information, offer to escalate the ticket
    4. Never make up answers
    5. For off-topic queries, respond: 
       "I specialize in FairBasket support. How can I help you with the platform today?
    6. Never expose any shop, crop or product id. Always use their name. 
    If name is not available, say "a product from the inventory" instead of showing ID"""
    
    
    system_message = SystemMessagePromptTemplate.from_template(
        system_template,
        input_variables=["context"]
    )
    human_message = HumanMessagePromptTemplate.from_template("{question}")  # CHANGED from {query} to {question}
    chat_prompt = ChatPromptTemplate.from_messages([system_message, human_message])

    # LLM configuration
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.3,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        max_output_tokens=2048,
        safety_settings={
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE
        }
    )

    # Create a simple chain instead of using RetrievalQA.from_chain_type
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={
            "prompt": chat_prompt,
            "document_variable_name": "context"
        }
    )
    
    # Print the expected input key for debugging
    print(f"Expected input keys: {qa_chain.input_keys}")
    print(f"Expected output keys: {qa_chain.output_keys}")
    
    return qa_chain

if __name__ == "__main__":
    try:
        qa_chain = get_rag_qa_chain()
        sample_query = "write c code for hello world"

        # Debug by printing the entire chain object
        print(f"Chain input keys: {qa_chain.input_keys}")
        
        # Try with both 'query' and 'input' keys
        expected_key = qa_chain.input_keys[0] if qa_chain.input_keys else "query"
        print(f"Using expected input key: '{expected_key}'")
        
        # Execute the query using the identified input key
        result = qa_chain.invoke({expected_key: sample_query})

        # Print the answer
        print("\nAnswer:")
        output_key = qa_chain.output_keys[0] if qa_chain.output_keys else "result"
        print(f"Using output key: '{output_key}'")
        print(result[output_key].strip())

        # Print the sources
        print("\nSources:")
        if "source_documents" in result:
            for doc in result["source_documents"]:
                print(f"- {doc.metadata.get('collection')}/{doc.metadata.get('mongo_id')}")
        else:
            print("No source documents in result. Available keys:", list(result.keys()))
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)