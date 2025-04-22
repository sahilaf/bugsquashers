from flask import Flask, request, jsonify
from flask_cors import CORS
from modules.rag_chain import get_rag_qa_chain

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize the RAG QA chain
qa_chain = get_rag_qa_chain()

@app.route('/api/query', methods=['POST'])
def query():
    """Endpoint to handle user queries."""
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

if __name__ == '__main__':
    app.run(debug=True)
