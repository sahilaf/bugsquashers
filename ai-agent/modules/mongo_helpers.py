# modules/mongo_helpers.py

from pymongo import MongoClient
from langchain_core.documents import Document
import os
from dotenv import load_dotenv
from typing import List
from datetime import datetime

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")


def load_products_from_mongo() -> List[Document]:
    """Fetch and format product/shop data for LLM context, embedding real names."""
    documents: List[Document] = []

    with MongoClient(MONGO_URI) as client:
        db = client[DB_NAME]

        # ——— PRODUCTS ———
        if "products" in db.list_collection_names():
            for product in db["products"].find():
                try:
                    # Build page content (for vector embeddings)
                    parts = [
                        f"Product: {product['name']}",
                        f"Category: {product['category']}",
                        f"Price: ${product['price']:.2f}",
                        f"Quantity Available: {product['quantity']}",
                        f"Organic: {'Yes' if product['isOrganic'] else 'No'}"
                    ]
                    if desc := product.get("description"):
                        parts.insert(1, f"Description: {desc}")
                    if features := product.get("keyFeatures"):
                        parts.append("Key Features: " + ", ".join(features))
                    if orig := product.get("originalPrice"):
                        discount = ((orig - product["price"]) / orig) * 100
                        parts.append(f"Discount: {discount:.0f}%")

                    metadata = {
                        "mongo_id": str(product["_id"]),
                        "collection": "products",
                        "category": product["category"],
                        "price": product["price"],
                        "name": product["name"],             # ← real product name
                    }

                    documents.append(Document(
                        page_content="\n".join(parts),
                        metadata=metadata
                    ))
                except KeyError as e:
                    print(f"Skipping product missing field {e}")

        # ——— SHOPS ———
        if "shops" in db.list_collection_names():
            for shop in db["shops"].find():
                try:
                    lon, lat = shop["location"]["coordinates"]
                    parts = [
                        f"Shop: {shop['name']}",
                        f"Category: {shop['category']}",
                        f"Location: Lat {lat:.4f}, Lon {lon:.4f}",
                        f"Organic Certified: {'Yes' if shop['isOrganicCertified'] else 'No'}",
                        f"Local Farm: {'Yes' if shop['isLocalFarm'] else 'No'}",
                        f"Products Available: {len(shop.get('products', []))}"
                    ]
                    if rating := shop.get("rating"):
                        parts.append(f"Rating: {rating}/5")
                    if created := shop.get("createdAt"):
                        date = datetime.fromisoformat(created.isoformat())
                        parts.append(f"Established: {date:%Y-%m-%d}")

                    metadata = {
                        "mongo_id": str(shop["_id"]),
                        "collection": "shops",
                        "category": shop["category"],
                        "shop_name": shop["name"],          # ← real shop name
                        "coordinates": [lat, lon]
                    }

                    documents.append(Document(
                        page_content="\n".join(parts),
                        metadata=metadata
                    ))
                except KeyError as e:
                    print(f"Skipping shop missing field {e}")

    return documents
