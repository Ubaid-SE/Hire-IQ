import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Recommended() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommended()
  }, [])

  const fetchRecommended = async () => {
    try {
      const res = await API.get('/candidates/recommended')
      setCandidates(res.data.candidates)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">⭐ Recommended Candidates</h2>
        <p className="text-gray-400 text-sm mt-1">
          {candidates.length} Candidates Scoring more than 60% based on the Job Description and CVs analyzed.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 bg-surface-900 rounded-2xl border border-surface-700">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-gray-400 text-lg">No Recommend candidate</p>
          <p className="text-gray-500 text-sm mt-2">CVs analyze first</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 bg-brand-600 hover:bg-brand-700 px-6 py-2 rounded-xl transition"
          >
            View jobs
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {candidates.map((c, index) => (
            <div
              key={c._id}
              onClick={() => navigate(`/candidates/${c._id}`)}
              className="bg-surface-900 p-5 rounded-2xl border border-brand-500/20 hover:border-brand-500/50 cursor-pointer transition group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-400' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-brand-500/20 text-brand-400'}`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-brand-300 transition">
                      {c.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{c.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getScoreColor(c.overall_score)}`}>
                    {c.overall_score}%
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    {c.recommendation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recommended
