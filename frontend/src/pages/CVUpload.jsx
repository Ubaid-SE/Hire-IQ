import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function CVUpload() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert('CV select karo!')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('cv', file)
      formData.append('job_id', jobId)

      const res = await API.post('/candidates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setResult(res.data.candidate)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
    } else {
      alert('Sirf PDF file allowed hai!')
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
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
      </nav>

      <div className="p-8 max-w-2xl mx-auto">

        {!result ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Upload CV</h2>
              <p className="text-gray-400 mt-1">
                Upload CV in PDF — AI will analyze!
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition ${
                  dragOver
                    ? 'border-blue-500 bg-blue-500/10'
                    : file
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/5'
                }`}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />

                {file ? (
                  <>
                    <p className="text-5xl mb-4">📄</p>
                    <p className="text-green-400 font-semibold text-lg">
                      ✅ {file.name}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-gray-400 text-sm mt-3">
                      Click to select another file
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-5xl mb-4">☁️</p>
                    <p className="text-gray-300 font-semibold text-lg">
                      Drag & Drop CV here
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Or Click to Choose File
                    </p>
                    <p className="text-gray-600 text-xs mt-4">
                      Only PDF — Max 5MB
                    </p>
                  </>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <div>
                      <p>AI is Analyzing...</p>
                      <p className="text-blue-200 text-xs">Might take 1-2 min</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Upload & Analyze CV</span>
                  </>
                )}
              </button>

              {/* Info */}
              {!loading && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-400 text-sm font-semibold mb-2">
                    🤖 What Ai will do?
                  </p>
                  <ul className="space-y-1">
                    {[
                      'Extract data from CV',
                      'Match job requirements',
                      'Calculate Score',
                      'Generate Interview Questions',
                      'Create An Email Draft'
                    ].map((item, i) => (
                      <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
                        <span className="text-blue-400">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Loading Steps */}
              {loading && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm font-semibold mb-3">
                    Processing Steps:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'CV Parser Agent — Extracting Text',
                      'Job Match Agent — Comparing Requirements',
                      'Scoring Agent — Calculating Score',
                      'Interview Agent — Generating Questions',
                      'Email Agent — Generating Draft'
                    ].map((step, i) => (
                      <li key={i} className="text-gray-500 text-xs flex items-center gap-2">
                        <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </>
        ) : (
          // Result Section
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analysis Complete! 🎉</h2>
              <button
                onClick={() => navigate(`/candidates/${result._id}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm transition"
              >
                Full Detail →
              </button>
            </div>

            {/* Result Card */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{result.name}</h3>
                    <p className="text-gray-400">{result.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-bold ${getScoreColor(result.overall_score)}`}>
                    {result.overall_score}%
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getBadgeStyle(result.recommendation)}`}>
                    {result.recommendation}
                  </span>
                </div>
              </div>

              {/* Score Bar */}
              <div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreBg(result.overall_score)}`}
                    style={{ width: `${result.overall_score}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h4 className="font-semibold mb-3">🛠️ Skills Found</h4>
              <div className="flex gap-2 flex-wrap">
                {result.parsed_data?.skills?.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setResult(null)}
                className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition font-semibold"
              >
                📤 Aur CV Upload karo
              </button>
              <button
                onClick={() => navigate(`/candidates/${result._id}`)}
                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl transition font-semibold"
              >
                📊 Full Analysis Dekho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CVUpload