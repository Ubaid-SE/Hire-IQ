from flask import Flask, request, jsonify
from flask_cors import CORS
from orchestrator import process_candidate
import os
import base64
import tempfile

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
        data = request.json
        
        pdf_base64 = data.get('pdf_base64')
        job_data = data.get('job_data')
        
        # Validation
        if not pdf_base64:
            return jsonify({
                "error": "pdf_base64 required hai!"
            }), 400
            
        if not job_data:
            return jsonify({
                "error": "job_data required hai!"
            }), 400

        # Base64 decode karke temp file banao
        pdf_bytes = base64.b64decode(pdf_base64)
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp.write(pdf_bytes)
            tmp_path = tmp.name

        try:
            # Process karo
            result = process_candidate(tmp_path, job_data)
        finally:
            # Temp file delete karo
            os.unlink(tmp_path)
        
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
        port=int(os.environ.get('PORT', 5001)),
        debug=False
    )