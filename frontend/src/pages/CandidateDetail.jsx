import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

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
    if (!confirm('Are you sure you want to delete this candidate?')) return
    try {
      await API.delete(`/candidates/${id}`)
      navigate(-1)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBadgeStyle = (recommendation) => {
    if (recommendation === 'Highly Recommended')
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    if (recommendation === 'Recommended')
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    return 'bg-red-500/20 text-red-400 border border-red-500/30'
  }

  // Score data for pie chart
  const getScoreData = () => {
    if (!candidate?.match_analysis) return []
    
    const skillsScore = candidate.match_analysis?.skills_match?.match_percentage || 0
    const experienceScore = candidate.match_analysis?.experience_match?.is_match ? 100 : 0
    const educationScore = candidate.match_analysis?.education_match?.is_suitable ? 100 : 0

    return [
      { name: 'Skills', value: skillsScore },
      { name: 'Experience', value: experienceScore },
      { name: 'Education', value: educationScore }
    ]
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )

  if (!candidate) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-400">Candidate not found!</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 px-6 py-2 rounded-xl"
        >
          Go Back
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            🧠
          </div>
          <h1 className="text-xl font-bold">HireIQ</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>
          <button
            onClick={deleteCandidate}
            className="bg-red-600/20 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white text-sm px-4 py-2 rounded-lg transition"
          >
            🗑️ Delete
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-5xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-gray-400">{candidate.email}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {candidate.parsed_data?.education}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-5xl font-bold ${getScoreColor(candidate.overall_score)}`}>
                {candidate.overall_score}%
              </p>
              <span className={`text-sm px-3 py-1 rounded-full ${getBadgeStyle(candidate.recommendation)}`}>
                {candidate.recommendation}
              </span>
            </div>
          </div>

          {/* Score Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Overall Match Score</span>
              <span>{candidate.overall_score}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getScoreBg(candidate.overall_score)}`}
                style={{ width: `${candidate.overall_score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Score Breakdown with Pie Chart */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="font-semibold text-lg mb-6">📊 Match Analysis</h3>
          <div className="grid grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={getScoreData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Skills Match</p>
                <p className={`text-3xl font-bold ${getScoreColor(candidate.match_analysis?.skills_match?.match_percentage)}`}>
                  {candidate.match_analysis?.skills_match?.match_percentage}%
                </p>
                <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreBg(candidate.match_analysis?.skills_match?.match_percentage)}`}
                    style={{ width: `${candidate.match_analysis?.skills_match?.match_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Experience</p>
                <p className={`text-3xl font-bold ${candidate.match_analysis?.experience_match?.is_match ? 'text-green-400' : 'text-red-400'}`}>
                  {candidate.match_analysis?.experience_match?.is_match ? '✅ Match' : '❌ No Match'}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Required: {candidate.match_analysis?.experience_match?.required}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Education</p>
                <p className={`text-3xl font-bold ${candidate.match_analysis?.education_match?.is_suitable ? 'text-green-400' : 'text-red-400'}`}>
                  {candidate.match_analysis?.education_match?.is_suitable ? '✅ Suitable' : '❌ Not Suitable'}
                </p>
              </div>
            </div>
          </div>

          {/* Missing Skills */}
          {candidate.match_analysis?.skills_match?.missing?.length > 0 && (
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-2">❌ Missing Skills</p>
              <div className="flex gap-2 flex-wrap">
                {candidate.match_analysis.skills_match.missing.map(skill => (
                  <span
                    key={skill}
                    className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Candidate Skills */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="font-semibold text-lg mb-4">🛠️ Candidate Skills</h3>
          <div className="flex gap-2 flex-wrap">
            {candidate.parsed_data?.skills?.map(skill => (
              <span
                key={skill}
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        {(candidate.parsed_data?.strengths || candidate.parsed_data?.weaknesses) && (
          <div className="grid grid-cols-2 gap-6">
            {candidate.parsed_data?.strengths && (
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="font-semibold text-lg mb-4 text-green-400">💪 Strengths</h3>
                <ul className="space-y-2">
                  {candidate.parsed_data.strengths?.map((s, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {candidate.parsed_data?.weaknesses && (
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="font-semibold text-lg mb-4 text-red-400">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {candidate.parsed_data.weaknesses?.map((w, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">✗</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Interview Questions */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h3 className="font-semibold text-lg mb-4">❓ Interview Questions</h3>
          <ol className="space-y-3">
            {candidate.interview_questions?.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 bg-gray-800 rounded-xl"
              >
                <span className="bg-blue-600/20 text-blue-400 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-gray-300 text-sm">{q}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Email Draft */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">✉️ Email Draft</h3>
            <button
              onClick={copyEmail}
              className={`px-4 py-2 rounded-lg text-sm transition font-medium ${
                copied
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? '✅ Copied!' : '📋 Copy Email'}
            </button>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {candidate.email_draft}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CandidateDetail