from cv_parser_agent import parse_cv
from job_match_agent import match_job
from scoring_agent import score_candidate
from interview_agent import generate_interview_questions
from email_agent import write_email
import json

def process_candidate(pdf_path, job_data):
    """
    Pura hiring process ek saath karo
    
    Flow:
    1. CV parse karo
    2. Job se match karo
    3. Score do
    4. Interview questions banao
    5. Email draft karo
    """
    
    print(f"\n{'='*50}")
    print(f"Processing: {pdf_path}")
    print(f"{'='*50}")
    
    # Step 1 — CV Parse Karo
    print("\n⏳ Step 1: CV Parsing...")
    cv_data = parse_cv(pdf_path)
    print(f" CV Parsed: {cv_data.get('name', 'Unknown')}")
    
    # Step 2 — Job Match Karo
    print("\n⏳ Step 2: Job Matching...")
    match_data = match_job(cv_data, job_data)
    print(f" Match: {match_data['overall_match']['percentage']}%")
    
    # Step 3 — Score Do
    print("\n⏳ Step 3: Scoring...")
    score_data = score_candidate(cv_data, match_data)
    print(f" Score: {score_data['overall_score']}/100")
    
    # Step 4 — Interview Questions
    print("\n⏳ Step 4: Interview Questions...")
    questions_data = generate_interview_questions(cv_data, job_data, match_data)
    print(f" Questions Generated!")
    
    # Step 5 — Email Draft
    print("\n⏳ Step 5: Email Writing...")
    email_data = write_email(cv_data, job_data, score_data)
    print(f" Email: {email_data['email_type']}")
    
    # Final Result
    result = {
        "candidate_info": cv_data,
        "match_analysis": match_data,
        "score": score_data,
        "interview_questions": questions_data,
        "email_draft": email_data
    }
    
    print(f"\n{'='*50}")
    print(f" Processing Complete!")
    print(f"Final Score: {score_data['overall_score']}/100")
    print(f"Recommendation: {score_data['recommendation']}")
    print(f"{'='*50}\n")
    
    return result

# Test karne ke liye
if __name__ == "__main__":
    # Sample job data
    test_job = {
        "title": "React Developer",
        "description": "We need an experienced React developer",
        "required_skills": ["React", "JavaScript", "CSS", "Node.js"],
        "experience_required": "2 years",
        "company": "HireIQ"
    }
    
    print("Orchestrator Ready!")
    print("Job:", test_job['title'])