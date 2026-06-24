import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function CandidateDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchCandidate()
  }, [])

  const fetchCandidate = async () => {
    try {
      const res = await API.get(`/candidates/${id}`)
      setCandidate(res.data.candidate)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(candidate.email_draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteCandidate = async () => {
    if (!confirm('Candidate delete karna chahte ho?')) return
    try {
      await API.delete(`/candidates/${id}`)
      navigate(-1)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>
  if (!candidate) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Candidate nahi mila!</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">HireIQ</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
            ← Back
          </button>
          <button
            onClick={deleteCandidate}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Delete Candidate
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <p className="text-gray-400">{candidate.email}</p>
              <p className="text-gray-500 text-sm mt-1">{candidate.parsed_data?.education}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-400">{candidate.overall_score}%</p>
              <span className={`text-sm px-3 py-1 rounded-full ${
                candidate.recommendation === 'Highly Recommended'
                  ? 'bg-green-500/20 text-green-400'
                  : candidate.recommendation === 'Recommended'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {candidate.recommendation}
              </span>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-4">Match Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Skills Match</p>
              <p className="text-xl font-bold text-blue-400">{candidate.match_analysis?.skills_match?.match_percentage}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Experience</p>
              <p className="text-xl font-bold text-green-400">{candidate.match_analysis?.experience_match?.is_match ? '✅ Match' : '❌ No Match'}</p>
            </div>
          </div>

          {candidate.match_analysis?.skills_match?.missing?.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Missing Skills</p>
              <div className="flex gap-2 flex-wrap">
                {candidate.match_analysis.skills_match.missing.map(skill => (
                  <span key={skill} className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-3">Candidate Skills</h3>
          <div className="flex gap-2 flex-wrap">
            {candidate.parsed_data?.skills?.map(skill => (
              <span key={skill} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-3">Interview Questions</h3>
          <ol className="space-y-2">
            {candidate.interview_questions?.map((q, i) => (
              <li key={i} className="text-gray-300 text-sm">
                <span className="text-blue-400 font-semibold">{i + 1}.</span> {q}
              </li>
            ))}
          </ol>
        </div>

        {/* Email Draft */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Email Draft</h3>
            <button
              onClick={copyEmail}
              className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded-lg transition"
            >
              {copied ? '✅ Copied!' : 'Copy Email'}
            </button>
          </div>
          <pre className="text-gray-400 text-sm whitespace-pre-wrap">{candidate.email_draft}</pre>
        </div>

      </div>
    </div>
  )
}

export default CandidateDetail