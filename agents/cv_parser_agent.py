import sys
from google import genai
from dotenv import load_dotenv
import fitz  # pymupdf
import json
import os

load_dotenv()

from gemini_helper import generate_content_with_retry

# Ensure stdout and stderr use UTF-8 to prevent UnicodeEncodeErrors on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_text_from_pdf(pdf_path):
    """PDF se text nikalo"""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def parse_cv(pdf_path):
    """CV parse karo aur structured data nikalo (Supports Text and Scanned PDFs)"""
    
    # PDF se text nikalo
    cv_text = extract_text_from_pdf(pdf_path)
    clean_text = cv_text.strip()
    
    prompt = """
    Analyze this CV and extract information in JSON format only.
    No extra text, just JSON.
    
    Return this exact JSON structure:
    {
        "name": "candidate name",
        "email": "email address",
        "phone": "phone number",
        "skills": ["skill1", "skill2"],
        "experience_years": "total years",
        "education": "highest degree",
        "previous_jobs": ["job1", "job2"],
        "summary": "brief professional summary"
    }
    """
    
    # Agar text empty hai ya chhota hai, scanned/image PDF flow use karo
    if len(clean_text) > 20:
        print("   Using local text-based parsing...")
        full_prompt = f"""
        {prompt}
        
        CV Text:
        {cv_text}
        """
        response = generate_content_with_retry(
            client=client,
            model="gemini-3.1-flash-lite",
            contents=full_prompt
        )
    else:
        print("   Using Gemini Files API for scanned/image PDF parsing...")
        uploaded_file = client.files.upload(file=pdf_path)
        try:
            response = generate_content_with_retry(
                client=client,
                model="gemini-3.1-flash-lite",
                contents=[uploaded_file, prompt]
            )
        finally:
            try:
                client.files.delete(name=uploaded_file.name)
            except Exception as e:
                print(f"Warning: Failed to delete uploaded file {uploaded_file.name}: {e}")
    
    # Response clean karo
    result = response.text.strip()
    
    # Robust JSON block extraction
    start_idx = result.find('{')
    end_idx = result.rfind('}')
    if start_idx != -1 and end_idx != -1:
        result = result[start_idx:end_idx + 1]
    else:
        # Fallback to general cleans
        result = result.replace("```json", "").replace("```", "").strip()
    
    # JSON parse karo
    parsed_data = json.loads(result)
    
    return parsed_data

# Test karne ke liye
if __name__ == "__main__":
    print("CV Parser Agent Ready!")