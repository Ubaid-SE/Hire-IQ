from flask import Flask, request, jsonify
from flask_cors import CORS
from orchestrator import process_candidate
import os

app = Flask(__name__)
CORS(app)

# Test route
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "HireIQ Agents Running! ✅"
    })

# Main route — CV process karo
@app.route('/process', methods=['POST'])
def process():
    try:
        # Request se data lo
        data = request.json
        
        pdf_path = data.get('pdf_path')
        job_data = data.get('job_data')
        
        # Validation
        if not pdf_path:
            return jsonify({
                "error": "pdf_path required hai!"
            }), 400
            
        if not job_data:
            return jsonify({
                "error": "job_data required hai!"
            }), 400
        
        # File exist karti hai?
        if not os.path.exists(pdf_path):
            return jsonify({
                "error": "CV file nahi mili!"
            }), 404
        
        # Process karo
        result = process_candidate(pdf_path, job_data)
        
        return jsonify({
            "success": True,
            "result": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )