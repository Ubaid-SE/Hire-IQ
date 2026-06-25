from google import genai
from dotenv import load_dotenv
import json
import os
from gemini_helper import generate_content_with_retry

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def write_email(cv_data, job_data, score_data):
    """Candidate ko email draft karo"""
    
    prompt = f"""
    Write a professional email for this candidate.
    Return JSON only, no extra text.
    
    Candidate:
    Name: {cv_data.get('name', 'Candidate')}
    Email: {cv_data.get('email', '')}
    
    Job:
    Title: {job_data['title']}
    Company: {job_data.get('company', 'Our Company')}
    
    Score:
    Overall Score: {score_data['overall_score']}
    Recommendation: {score_data['recommendation']}
    Hiring Decision: {score_data['hiring_decision']}
    
    Return this exact JSON:
    {{
        "subject": "email subject here",
        "body": "complete email body here",
        "email_type": "interview_invite or rejection or shortlist"
    }}
    
    Rules:
    - If score >= 70 = Interview invite email
    - If score 50-69 = Shortlist email
    - If score < 50 = Rejection email (polite)
    - Professional tone
    - Mention candidate name
    - Mention job title
    - Keep it concise
    """
    
    response = generate_content_with_retry(
        client=client,
        model="gemini-3.1-flash-lite",
        contents=prompt
    )
    
    result = response.text.strip()
    result = result.replace("```json", "").replace("```", "").strip()
    
    # Robust JSON block extraction
    start_idx = result.find('{')
    end_idx = result.rfind('}')
    if start_idx != -1 and end_idx != -1:
        result = result[start_idx:end_idx + 1]
    
    email_data = json.loads(result)
    
    return email_data

# Test
if __name__ == "__main__":
    print("Email Writer Agent Ready!")