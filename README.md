# HireIQ — AI-Powered Hiring Agent System

> Built for the **Google 5-Day AI Agents Intensive — Kaggle Capstone 2026**

HireIQ is a full-stack AI hiring assistant that automates the entire candidate screening process. Upload a CV, and five specialized AI agents analyze it, score the candidate, generate interview questions, and draft a personalized email — all in seconds.

---

## 🎥 Demo



---

## 🏗️ Architecture

```
Frontend (React + Vite)
        ↓
Backend (Node.js + Express + MongoDB)
        ↓
Agent Layer (Python, Flask)
        ↓
Google Gemini API
```

### 5 AI Agents Pipeline

```
CV (PDF)
   ↓
[1] CV Parser Agent      → Extracts name, skills, experience
   ↓
[2] Job Match Agent      → Compares CV with job requirements
   ↓
[3] Scoring Agent        → Gives 0–100 score with grade
   ↓
[4] Interview Agent      → Generates custom interview questions
   ↓
[5] Email Agent          → Drafts acceptance / rejection email
```

All agents are pure Python functions powered by **Google Gemini API** — no heavy agent framework needed. The `orchestrator.py` chains them in sequence.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express 5, MongoDB Atlas, JWT Auth |
| Agent Layer | Python, Flask, Google Gemini API |
| MCP Server | FastMCP |
| File Handling | Multer (uploads), PyMuPDF (PDF parsing) |

---

## 📁 Project Structure

```
Hire-IQ/
├── frontend/          # React + Vite app
├── backend/           # Node.js + Express API
├── agents/            # Python AI agents + Flask server
│   ├── orchestrator.py
│   ├── cv_parser_agent.py
│   ├── job_match_agent.py
│   ├── scoring_agent.py
│   ├── interview_agent.py
│   ├── email_agent.py
│   ├── gemini_helper.py
│   └── app.py
└── mcp_server/        # FastMCP server
    └── server.py
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB Atlas account (free tier works)
- Google Gemini API key → [Get it here](https://aistudio.google.com/)

---

### 1. Clone the repo

```bash
git clone https://github.com/Ubaid-SE/Hire-IQ.git
cd Hire-IQ
```

---

### 2. Backend Setup (Node.js)

```bash
cd backend
npm install
```

Create `.env` file (see `.env.example`):

```bash
cp .env.example .env
# Fill in your values
```

Start the server:

```bash
npm run dev
# Runs on http://localhost:5000
```

---

### 3. Agent Layer Setup (Python)

```bash
cd agents
pip install google-genai flask flask-cors python-dotenv pymupdf requests
```

Create `.env` file:

```bash
cp .env.example .env
# Fill in your Gemini API key
```

Start the Flask server:

```bash
python app.py
# Runs on http://localhost:5001
```

---

### 4. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

### 5. MCP Server (Optional)

```bash
cd mcp_server
pip install fastmcp pymupdf requests python-dotenv
python server.py
```

---

## 🚀 How to Use

1. Register as HR Manager
2. Create a Job with required skills
3. Upload CV(s) — single or bulk upload
4. AI agents automatically process each CV
5. View candidate scores, match analysis, interview questions, and email draft
6. Check Recommended tab for top candidates (score ≥ 60)

---

## ✨ Features

- **Single & Bulk CV Upload** — process multiple CVs at once
- **AI Scoring** — 0–100 score with grade (A/B/C/D/F)
- **Job Match Analysis** — matched vs missing skills
- **Custom Interview Questions** — based on candidate's actual CV
- **Email Draft** — auto-generated interview invite or rejection email
- **Scanned PDF Support** — uses Gemini Files API for image-based PDFs
- **Retry Logic** — exponential backoff for Gemini API rate limits
- **JWT Authentication** — secure HR manager login

---

## 🔑 Environment Variables

See `.env.example` files in `/backend` and `/agents` folders.

---

## 👤 Author

**M. Ubaid ur Rehman**
- GitHub: [@Ubaid-SE](https://github.com/Ubaid-SE)
- Fiverr: [Eng. Ubaid](https://www.fiverr.com)

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)