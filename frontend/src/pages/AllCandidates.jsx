import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function AllCandidates() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const res = await API.get('/candidates/all')
      setCandidates(res.data.candidates)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBadgeStyle = (rec) => {
    if (rec === 'Highly Recommended')
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    if (rec === 'Recommended')
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    return 'bg-red-500/20 text-red-400 border border-red-500/30'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">All CVs Analyzed 📄</h2>
        <p className="text-gray-400 text-sm mt-1">
          {candidates.length} total candidates
        </p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Candidate search karo..."
        className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-5xl mb-4">📄</p>
          <p className="text-gray-400">Koi candidate nahi mila</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c, index) => (
            <div
              key={c._id}
              onClick={() => navigate(`/candidates/${c._id}`)}
              className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-500/50 cursor-pointer transition group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center font-bold text-sm text-blue-400">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold group-hover:text-blue-400 transition">
                      {c.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.overall_score >= 70 ? 'bg-green-500' :
                        c.overall_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${c.overall_score}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(c.overall_score)}`}>
                      {c.overall_score}%
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getBadgeStyle(c.recommendation)}`}>
                      {c.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllCandidates