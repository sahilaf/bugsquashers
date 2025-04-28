# modules/recommendation_chain.py

import os
from typing import List, Dict, Any
from dotenv import load_dotenv

from langchain.chains.base import Chain
from langchain.chains import LLMChain
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.utils import filter_complex_metadata
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI

from modules.mongo_helpers import load_products_from_mongo

load_dotenv()

class ProductRecommendationChain(Chain):
    """Retrieves named products under budget, dedupes, then asks LLM to recommend."""

    retriever: Any
    llm_chain: LLMChain

    class Config:
        arbitrary_types_allowed = True

    @property
    def input_keys(self) -> List[str]:
        return ["query", "budget"]

    @property
    def output_keys(self) -> List[str]:
        return ["result", "source_documents", "budget"]

    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        query = inputs["query"].strip()
        budget = inputs["budget"]

        if not query:
            raise ValueError("Query cannot be empty")
        if budget is None or budget <= 0:
            raise ValueError("Budget must be a positive number")

        # 1) Retrieve & budget‐filter
        docs = self.retriever.get_relevant_documents(query)
        prods = [
            d for d in docs
            if d.metadata.get("collection") == "products"
               and isinstance(d.metadata.get("price"), (int, float))
               and d.metadata["price"] <= budget
        ]
        # sort by price, dedupe by mongo_id, max 10
        seen_ids = set()
        unique = []
        for d in sorted(prods, key=lambda d: d.metadata["price"]):
            mid = d.metadata["mongo_id"]
            if mid not in seen_ids:
                seen_ids.add(mid)
                unique.append(d)
            if len(unique) >= 10:
                break

        # 2) Build markdown context using real names
        if unique:
            lines = []
            for d in unique:
                name = d.metadata.get("name", "<unknown>")
                price = d.metadata["price"]
                shop = d.metadata.get("shop_name", "Unknown shop")
                lines.append(f"- **{name}** — ${price:.2f} @ {shop}")
            context = "\n".join(lines)
        else:
            context = "No products found within budget."

        # 3) Invoke the LLM
        result = self.llm_chain.run({
            "context": context,
            "query": query,
            "budget": f"${budget:.2f}"
        })

        return {
            "result": result.strip(),
            "source_documents": unique,
            "budget": f"${budget:.2f}"
        }

def get_recommendation_chain() -> ProductRecommendationChain:
    """Builds and returns the budget-aware recommendation chain."""
    # — load & chunk documents
    docs = load_products_from_mongo()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600, chunk_overlap=100,
        separators=["\nShop:", "\nProduct:", "\n\n", "\n"]
    )
    chunks = splitter.split_documents(docs)
    clean_chunks = filter_complex_metadata(chunks)

    # — embeddings & vectorstore
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        task_type="retrieval_query",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    vectordb = Chroma.from_documents(
        documents=clean_chunks,
        embedding=embeddings,
        persist_directory="chroma_fairbasket",
        collection_metadata={"hnsw:space": "cosine"}
    )
    retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 20, "fetch_k": 40}
    )

    # — system + human prompt
    system_tmpl = (
        "You are FairBasket's AI shopping assistant. Your role is to help users find products "
        "within their budget while being HONEST and TRANSPARENT.\n\n"
        "GOLDEN RULES:\n"
        "1. NEVER invent or hallucinate products - only use what's in the context\n"
        "2. If no products match, clearly state this \n"
        "3. Maintain a friendly but professional tone as you're dealing with customer\n"
        "4. Prices must be exact from the context, never estimated"
    )
    human_tmpl = (
        "CONTEXT OF AVAILABLE PRODUCTS:\n{context}\n\n"
        "USER REQUEST: {query}\n"
        "BUDGET: {budget}\n\n"
        "RESPONSE GUIDELINES:\n"
        "1. IF PRODUCTS EXIST IN CONTEXT:\n"
        "   - Recommend 3-5 best matches with exact prices and shops\n"
        "   - For each item: Name, Price, Shop, Short reason (under 12 words)\n"
        "   - If budget remains, suggest one low-cost bonus item\n"
        "   - Format as numbered list with emojis\n\n"
        "2. IF NO PRODUCTS EXIST (CONTEXT EMPTY):\n"
        "   - Start with ❌ 'No matches found within {budget}'\n"
        "   - Suggest either:\n"
        "     a) Small budget increase needed (give exact amount)\n"
        "     b) Alternative similar categories\n"
        "   - Never suggest fictional products\n\n"
        "3. FINAL NOTE:\n"
        "   - Keep response under 200 words\n"
        "   - Use simple markdown formatting\n"
        "   - Maintain hopeful tone even when no matches\n"
        "   - Add relevant emojis for visual appeal"
    )
    chat_prompt = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(system_tmpl),
        HumanMessagePromptTemplate.from_template(human_tmpl),
    ])

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.2,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    llm_chain = LLMChain(llm=llm, prompt=chat_prompt)

    return ProductRecommendationChain(retriever=retriever, llm_chain=llm_chain)
