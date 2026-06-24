from google import genai
from dotenv import load_dotenv
import fitz  # pymupdf
import json
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_text_from_pdf(pdf_path):
    """PDF se text nikalo"""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def parse_cv(pdf_path):
    """CV parse karo aur structured data nikalo"""
    
    # PDF se text nikalo
    cv_text = extract_text_from_pdf(pdf_path)
    
    # Gemini ko prompt do
    prompt = f"""
    Analyze this CV and extract information in JSON format only.
    No extra text, just JSON.
    
    CV Text:
    {cv_text}
    
    Return this exact JSON structure:
    {{
        "name": "candidate name",
        "email": "email address",
        "phone": "phone number",
        "skills": ["skill1", "skill2"],
        "experience_years": "total years",
        "education": "highest degree",
        "previous_jobs": ["job1", "job2"],
        "summary": "brief professional summary"
    }}
    """
    
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )
    
    # Response clean karo
    result = response.text.strip()
    result = result.replace("```json", "").replace("```", "").strip()
    
    # JSON parse karo
    parsed_data = json.loads(result)
    
    return parsed_data

# Test karne ke liye
if __name__ == "__main__":
    print("CV Parser Agent Ready!")