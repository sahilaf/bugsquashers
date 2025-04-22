from pymongo import MongoClient
from langchain.schema import Document
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")
COLLECTION_NAMES = os.getenv("MONGO_COLLECTIONS", "").split(",")  # comma-separated names

def load_documents_from_mongo() -> list[Document]:
    """Fetches documents from multiple MongoDB collections and returns LangChain Documents."""

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    documents = []

    for collection_name in COLLECTION_NAMES:
        collection = db[collection_name.strip()]
        for doc in collection.find():
            text = "\n".join([f"{key}: {value}" for key, value in doc.items() if key != "_id"])
            metadata = {
                "mongo_id": str(doc["_id"]),
                "collection": collection_name.strip()
            }
            documents.append(Document(page_content=text, metadata=metadata))

    return documents


if __name__ == "__main__":
    docs = load_documents_from_mongo()
    for d in docs[:3]:
        print(f"Collection: {d.metadata['collection']}")
        print(d.page_content)
        print("="*60)
