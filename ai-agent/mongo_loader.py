from pymongo import MongoClient
from langchain_core.documents import Document  # langchain.schema is deprecated
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")
COLLECTION_NAMES = [name.strip() for name in os.getenv("MONGO_COLLECTIONS", "").split(",") if name.strip()]

def sanitize_document(doc: dict) -> dict:
    """Sanitize sensitive fields, prioritize names over IDs."""
    sanitized = {}
    for key, value in doc.items():
        key_lower = key.lower()

        # Skip internal MongoDB _id
        if key_lower == "_id":
            continue

        # Skip fields that look like IDs if a name/title/label exists
        if ("id" in key_lower or "_id" in key_lower) and any(
            alt in doc for alt in ["name", "title", "label"]
        ):
            continue

        # Hide IDs if no name is available
        if "id" in key_lower or "_id" in key_lower:
            sanitized[key] = "<hidden>"
        else:
            sanitized[key] = value

    return sanitized

def load_documents_from_mongo() -> list[Document]:
    """Fetch sanitized documents from MongoDB collections and return as LangChain Documents."""

    documents = []

    try:
        with MongoClient(MONGO_URI) as client:
            db = client[DB_NAME]
            available_collections = db.list_collection_names()

            for collection_name in COLLECTION_NAMES:
                if collection_name not in available_collections:
                    print(f"⚠️ Skipping missing collection: {collection_name}")
                    continue

                collection = db[collection_name]
                for doc in collection.find():
                    doc["_id"] = str(doc["_id"])  # convert ObjectId for metadata
                    clean_doc = sanitize_document(doc)
                    content = "\n".join(f"{k}: {v}" for k, v in clean_doc.items())
                    metadata = {
                        "mongo_id": doc["_id"],
                        "collection": collection_name
                    }
                    documents.append(Document(page_content=content, metadata=metadata))

    except Exception as e:
        raise RuntimeError(f"Failed to load documents: {str(e)}")

    return documents

if __name__ == "__main__":
    docs = load_documents_from_mongo()
    for d in docs[:3]:
        print(f"📂 Collection: {d.metadata['collection']}")
        print(d.page_content)
        print("="*60)
