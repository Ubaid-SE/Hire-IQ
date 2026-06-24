import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function CVUpload() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">HireIQ</h1>
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
          ← Back
        </button>
      </nav>

      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">CV Upload</h2>

        {!result ? (
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-blue-500 transition">
              <p className="text-gray-400 mb-4">PDF CV select karo</p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-gray-300"
              />
              {file && <p className="text-green-400 mt-2">✅ {file.name}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Processing... (thoda waqt lagega)' : 'Upload & Analyze'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Result Card */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{result.name}</h3>
                  <p className="text-gray-400">{result.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-400">{result.overall_score}%</p>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    result.recommendation === 'Highly Recommended'
                      ? 'bg-green-500/20 text-green-400'
                      : result.recommendation === 'Recommended'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {result.recommendation}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h4 className="font-semibold mb-3">Skills Match</h4>
              <div className="flex gap-2 flex-wrap">
                {result.parsed_data?.skills?.map(skill => (
                  <span key={skill} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Email Draft */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h4 className="font-semibold mb-3">Email Draft</h4>
              <pre className="text-gray-400 text-sm whitespace-pre-wrap">{result.email_draft}</pre>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition"
            >
              + Aur CV Upload karo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CVUpload