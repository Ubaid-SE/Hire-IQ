from google import genai
from dotenv import load_dotenv
import json
import os
from gemini_helper import generate_content_with_retry

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def score_candidate(cv_data, match_data):
    """Candidate ko score do"""
    
    prompt = f"""
    Based on this candidate data and job match analysis,
    give a final score. Return JSON only, no extra text.
    
    Candidate Data:
    {json.dumps(cv_data)}
    
    Match Analysis:
    {json.dumps(match_data)}
    
    Return this exact JSON:
    {{
        "technical_score": 85,
        "experience_score": 70,
        "education_score": 90,
        "overall_score": 82,
        "grade": "A",
        "recommendation": "Highly Recommended",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "hiring_decision": "Proceed to Interview"
    }}
    
    Scoring Rules:
    - overall_score = 0 to 100
    - grade = A, B, C, D, F
    - recommendation = Highly Recommended, Recommended, Not Recommended
    - hiring_decision = Proceed to Interview, Consider for Other Roles, Reject
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
    
    score_data = json.loads(result)
    
    return score_data

# Test
if __name__ == "__main__":
    print("Scoring Agent Ready!")