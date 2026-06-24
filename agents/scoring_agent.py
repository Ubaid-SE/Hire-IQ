from google import genai
from dotenv import load_dotenv
import json
import os

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
    
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )
    
    result = response.text.strip()
    result = result.replace("```json", "").replace("```", "").strip()
    
    score_data = json.loads(result)
    
    return score_data

# Test
if __name__ == "__main__":
    print("Scoring Agent Ready!")