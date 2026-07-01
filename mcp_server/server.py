from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
import requests
import json
import fitz
import os

load_dotenv()

BACKEND_URL = os.environ.get("BACKEND_URL", "https://hire-iq-production.up.railway.app")

# MCP Server banao
mcp = FastMCP("HireIQ MCP Server")

# Tool 1 — PDF Read Karo
@mcp.tool()
def read_pdf(file_path: str) -> str:
    """PDF file se text nikalo"""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

# Tool 2 — Job Details Lo
@mcp.tool()
def get_job_details(job_id: str) -> str:
    """Job ki details lo backend se"""
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/jobs/{job_id}"
        )
        return json.dumps(response.json())
    except Exception as e:
        return f"Error getting job: {str(e)}"

# Tool 3 — Skills Check Karo
@mcp.tool()
def check_skills_match(
    candidate_skills: list,
    required_skills: list
) -> str:
    """Candidate ki skills job se match karo"""
    candidate_lower = [s.lower() for s in candidate_skills]
    required_lower = [s.lower() for s in required_skills]
    
    matched = []
    missing = []
    
    for skill in required_lower:
        if skill in candidate_lower:
            matched.append(skill)
        else:
            missing.append(skill)
    
    percentage = (len(matched) / len(required_lower)) * 100 if required_lower else 0
    
    return json.dumps({
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": round(percentage, 2),
        "total_required": len(required_lower),
        "total_matched": len(matched)
    })

# Tool 4 — Email Draft Banao
@mcp.tool()
def create_email_draft(
    candidate_name: str,
    candidate_email: str,
    job_title: str,
    score: int
) -> str:
    """Candidate ko email draft banao"""
    if score >= 70:
        subject = f"Interview Invitation - {job_title}"
        body = f"""Dear {candidate_name},

We are pleased to inform you that after reviewing 
your application for the {job_title} position, 
we would like to invite you for an interview.

Please reply to schedule a convenient time.

Best regards,
HireIQ Team"""
        email_type = "interview_invite"

    elif score >= 50:
        subject = f"Application Update - {job_title}"
        body = f"""Dear {candidate_name},

Thank you for applying for the {job_title} position.
We have shortlisted your application for further review.

We will get back to you soon.

Best regards,
HireIQ Team"""
        email_type = "shortlist"

    else:
        subject = f"Application Status - {job_title}"
        body = f"""Dear {candidate_name},

Thank you for your interest in the {job_title} position.
After careful consideration, we have decided to 
move forward with other candidates.

We wish you the best in your job search.

Best regards,
HireIQ Team"""
        email_type = "rejection"

    return json.dumps({
        "subject": subject,
        "body": body,
        "email_type": email_type,
        "to": candidate_email
    })

# Tool 5 — Candidate Save Karo
@mcp.tool()
def save_candidate_result(
    candidate_id: str,
    score: int,
    recommendation: str
) -> str:
    """Candidate ka result save karo"""
    try:
        response = requests.patch(
            f"{BACKEND_URL}/api/candidates/{candidate_id}",
            json={
                "overall_score": score,
                "recommendation": recommendation
            }
        )
        return json.dumps(response.json())
    except Exception as e:
        return f"Error saving: {str(e)}"

if __name__ == "__main__":
    import uvicorn
    print("HireIQ MCP Server Starting! 🚀")
    port = int(os.environ.get("PORT", 8000))
    app = mcp.streamable_http_app()
    uvicorn.run(app, host="0.0.0.0", port=port)