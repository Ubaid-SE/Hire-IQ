from google import genai
from dotenv import load_dotenv
import json
import os
from gemini_helper import generate_content_with_retry

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def match_job(cv_data, job_data):
    """CV ko job se match karo"""
    
    prompt = f"""
    Compare this candidate's CV with the job requirements.
    Return JSON only, no extra text.
    
    Candidate Data:
    {json.dumps(cv_data)}
    
    Job Requirements:
    Title: {job_data['title']}
    Description: {job_data['description']}
    Required Skills: {job_data['required_skills']}
    Experience Required: {job_data['experience_required']}
    
    Return this exact JSON:
    {{
        "skills_match": {{
            "matched": ["skill1", "skill2"],
            "missing": ["skill3", "skill4"],
            "match_percentage": 80
        }},
        "experience_match": {{
            "required": "2 years",
            "candidate_has": "3 years",
            "is_match": true
        }},
        "education_match": {{
            "is_suitable": true,
            "reason": "reason here"
        }},
        "overall_match": {{
            "percentage": 85,
            "verdict": "Strong Match"
        }}
    }}
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
    
    match_data = json.loads(result)
    
    return match_data

# Test
if __name__ == "__main__":
    print("Job Match Agent Ready! ")