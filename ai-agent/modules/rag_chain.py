import os
from typing import List
from dotenv import load_dotenv
from google.genai.types import HarmCategory, HarmBlockThreshold

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
    HumanMessagePromptTemplate
)

# Load environment variables from .env file
load_dotenv()

# Validate required environment variables
required_vars = ["MONGO_URI", "MONGO_DB_NAME", "GEMINI_API_KEY"]
missing = [v for v in required_vars if not os.getenv(v)]
if missing:
    raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Support guidelines file
GUIDELINES_FILE = os.getenv("SUPPORT_GUIDELINES_FILE", "support_guidelines.txt")

# Debug prints
print(f"CWD: {os.getcwd()}")
print(f"Looking for guidelines at: {os.path.abspath(GUIDELINES_FILE)}")
print(f"Exists: {os.path.exists(GUIDELINES_FILE)}")

def load_support_guidelines() -> str:
    try:
        with open(GUIDELINES_FILE, encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        raise FileNotFoundError(f"Guidelines not found at {GUIDELINES_FILE}")


def load_documents_from_mongo() -> List[Document]:
    docs: List[Document] = []
    with MongoClient(os.getenv("MONGO_URI")) as client:
        db = client[os.getenv("MONGO_DB_NAME")]
        collections = os.getenv("MONGO_COLLECTIONS", "").split(",")
        for cname in [c.strip() for c in collections if c.strip()]:
            if cname not in db.list_collection_names():
                print(f"Skipping missing: {cname}")
                continue
            for rec in db[cname].find():
                rec_id = str(rec.pop("_id"))
                content = "\n".join(f"{k}: {v}" for k, v in rec.items())
                metadata = {"mongo_id": rec_id, "collection": cname}
                docs.append(Document(page_content=content, metadata=metadata))
    return docs


def get_rag_qa_chain():
    docs = load_documents_from_mongo()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", "! ", "? ", ", ", " "]
    )
    chunks = splitter.split_documents(docs)

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
    retriever = vectordb.as_retriever(search_type="mmr", search_kwargs={"k": 5, "fetch_k": 10})

    guidelines = load_support_guidelines()
    system_tmpl = f"""You are FairBasket's Expert Support Assistant. Follow these guidelines:\n{guidelines}\n\nContext: {{context}}\n\nYour responsibilities:\n1. Answer only FairBasket questions\n2. Use provided context\n3. Escalate if unknown\n4. Never hallucinate\n5. For off-topic, respond politely\n6. Never expose IDs; use names or placeholders"""
    chat_prompt = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(system_tmpl, input_variables=["context"]),
        HumanMessagePromptTemplate.from_template("{question}")
    ])

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.3,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        max_output_tokens=2048,
        safety_settings={
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT.value: HarmBlockThreshold.BLOCK_NONE.value,
            HarmCategory.HARM_CATEGORY_HARASSMENT.value:       HarmBlockThreshold.BLOCK_NONE.value,
        }
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": chat_prompt, "document_variable_name": "context"}
    )

    print(f"Input keys: {qa_chain.input_keys}")
    print(f"Output keys: {qa_chain.output_keys}")
    return qa_chain


if __name__ == "__main__":
    chain = get_rag_qa_chain()
    key = chain.input_keys[0] if chain.input_keys else "query"
    res = chain.invoke({key: "write c code for hello world"})
    print(res.get(chain.output_keys[0], res))
