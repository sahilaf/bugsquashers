from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import traceback
from typing import List, Any, Dict
from modules.rag_chain import get_rag_qa_chain
from modules.recommendation_chain import get_recommendation_chain

# Models for request payloads
class QueryRequest(BaseModel):
    query: str

class RecommendRequest(BaseModel):
    query: str
    budget: float

# Initialize app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-init chains
qa_chain = None
recommendation_chain = None

@app.on_event("startup")
def startup_event():
    global qa_chain, recommendation_chain
    qa_chain = get_rag_qa_chain()
    recommendation_chain = get_recommendation_chain()

@app.post("/api/query")
def query(request: QueryRequest) -> Dict[str, Any]:
    if not request.query:
        raise HTTPException(status_code=400, detail="No query provided")
    try:
        result = qa_chain.invoke({"query": request.query})
        return {
            "answer": result.get("result", "").strip(),
            "sources": [
                f"{doc.metadata.get('collection')}/{doc.metadata.get('mongo_id')}"
                for doc in result.get("source_documents", [])
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
def recommend(request: RecommendRequest) -> Dict[str, Any]:
    if not request.query:
        raise HTTPException(status_code=400, detail="Missing 'query' parameter")
    if request.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be positive")

    try:
        result = recommendation_chain.invoke({"query": request.query, "budget": request.budget})
        sources: List[Dict[str, Any]] = []
        for doc in result.get("source_documents", []):
            info = {
                "type": doc.metadata.get('collection'),
                "id": doc.metadata.get('mongo_id'),
                "price": doc.metadata.get('price'),
                "category": doc.metadata.get('category')
            }
            if doc.metadata.get('collection') == 'shops':
                info["coordinates"] = doc.metadata.get('coordinates')
            sources.append(info)
        return {
            "recommendations": result.get("result", "").strip(),
            "budget_used": f"${request.budget:.2f}",
            "sources": sources
        }
    except Exception as e:
        traceback_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}\n{traceback_str}")

# If using uvicorn directly
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
