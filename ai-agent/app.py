# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from modules.rag_chain import get_rag_qa_chain
from modules.recommendation_chain import get_recommendation_chain

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize the RAG QA chain
qa_chain = get_rag_qa_chain()

# Initialize the recommendation chain
recommendation_chain = get_recommendation_chain()

@app.route('/api/query', methods=['POST'])
def query():
    """Endpoint to handle user support queries."""
    data = request.get_json()
    user_query = data.get('query')

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Execute the query using the RAG QA chain
        result = qa_chain.invoke({"query": user_query})
        response = {
            "answer": result.get("result", "").strip(),
            "sources": [
                f"{doc.metadata.get('collection')}/{doc.metadata.get('mongo_id')}"
                for doc in result.get("source_documents", [])
            ]
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """Handle product recommendations."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        user_query = data.get('query', '').strip()
        raw_budget = str(data.get('budget', '')).strip()

        if not user_query:
            return jsonify({"error": "Missing 'query' parameter"}), 400
        if not raw_budget:
            return jsonify({"error": "Missing 'budget' parameter"}), 400

        # Validate and normalize budget
        cleaned_budget = raw_budget.replace(",", "").replace("$", "").strip()
        try:
            budget_value = float(cleaned_budget)
            if budget_value <= 0:
                raise ValueError
        except ValueError:
            return jsonify({"error": "Invalid budget format. Example: 50, 100.5, etc."}), 400

        # Prepare structured input
        request_data = {
            "query": user_query,
            "budget": budget_value  # Pass as float now
        }

        # Call recommendation chain
        result = recommendation_chain.invoke(request_data)

        # Prepare response
        sources = []
        for doc in result.get("source_documents", []):
            source_info = {
                "type": doc.metadata.get('collection'),
                "id": doc.metadata.get('mongo_id'),
                "price": doc.metadata.get('price'),
                "category": doc.metadata.get('category')
            }
            if doc.metadata.get('collection') == 'shops':
                source_info["coordinates"] = doc.metadata.get('coordinates')
            sources.append(source_info)

        return jsonify({
            "recommendations": result.get("result", "").strip(),
            "budget_used": f"${budget_value:.2f}",
            "sources": sources
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({
            "error": "Failed to generate recommendations",
            "details": str(e)
        }), 500

    
if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
