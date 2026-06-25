from google import genai
from dotenv import load_dotenv
import json
import os
from gemini_helper import generate_content_with_retry

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_interview_questions(cv_data, job_data, match_data):
    """Custom interview questions generate karo"""
    
    prompt = f"""
    Generate personalized interview questions for this candidate.
    Return JSON only, no extra text.
    
    Candidate Data:
    {json.dumps(cv_data)}
    
    Job Details:
    Title: {job_data['title']}
    Required Skills: {job_data['required_skills']}
    
    Match Analysis:
    {json.dumps(match_data)}
    
    Return this exact JSON:
    {{
        "technical_questions": [
            "question 1",
            "question 2",
            "question 3"
        ],
        "experience_questions": [
            "question 1",
            "question 2"
        ],
        "behavioral_questions": [
            "question 1",
            "question 2"
        ],
        "weakness_questions": [
            "question about missing skill 1",
            "question about missing skill 2"
        ]
    }}
    
    Rules:
    - Technical questions = Skills se related
    - Experience questions = Past work se related
    - Behavioral questions = Soft skills se related
    - Weakness questions = Missing skills ke baare mein
    - Total 8-10 questions
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
    
    questions_data = json.loads(result)
    
    return questions_data

# Test
if __name__ == "__main__":
    print("Interview Questions Agent Ready!")