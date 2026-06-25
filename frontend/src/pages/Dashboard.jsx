import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCVs: 0,
    recommended: 0
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [recentJobs, setRecentJobs] = useState([])

  useEffect(() => {
    fetchStats()
    fetchRecentJobs()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/stats')
      setStats(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentJobs = async () => {
    try {
      const res = await API.get('/jobs')
      setRecentJobs(res.data.jobs.slice(0, 3))
    } catch (err) {
      console.log(err)
    }
  }

  const handleSearch = async (e) => {
    const val = e.target.value
    setSearch(val)
    if (val.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const res = await API.get('/candidates/all')
      const filtered = res.data.candidates.filter(c =>
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        c.email.toLowerCase().includes(val.toLowerCase())
      )
      setSearchResults(filtered.slice(0, 5))
    } catch (err) {
      console.log(err)
    } finally {
      setSearching(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">

      {/* Welcome + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-400 mt-1">
            {user?.company} — AI Hiring Dashboard
          </p>
        </div>

        {/* Global Search */}
        <div className="relative w-full md:w-80">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search Candidate..."
              className="w-full bg-surface-900 border border-surface-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-600/50 text-sm transition"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-surface-900 border border-surface-700 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
              {searchResults.map(c => (
                <div
                  key={c._id}
                  onClick={() => {
                    navigate(`/candidates/${c._id}`)
                    setSearch('')
                    setSearchResults([])
                  }}
                  className="flex justify-between items-center p-3 hover:bg-surface-800 cursor-pointer transition border-b border-surface-700 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-200">{c.name}</p>
                    <p className="text-gray-500 text-xs">{c.email}</p>
                  </div>
                  <p className={`text-sm font-bold ${getScoreColor(c.overall_score)}`}>
                    {c.overall_score}%
                  </p>
                </div>
              ))}
              <div
                onClick={() => {
                  navigate('/candidates')
                  setSearch('')
                  setSearchResults([])
                }}
                className="p-3 text-center text-brand-400 text-xs hover:bg-surface-800 cursor-pointer transition"
              >
                View All Candidates →
              </div>
            </div>
          )}

          {search.length >= 2 && searchResults.length === 0 && !searching && (
            <div className="absolute top-full mt-2 w-full bg-surface-900 border border-surface-700 rounded-xl p-4 text-center z-50">
              <p className="text-gray-400 text-sm">No Candidate Found</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards — Clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

        {/* Total Jobs */}
        <div
          onClick={() => navigate('/jobs')}
          className="bg-surface-900 p-6 rounded-2xl border border-surface-700 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/20 cursor-pointer transition group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500/30 to-brand-700/30 rounded-xl flex items-center justify-center text-2xl group-hover:from-brand-500/50 group-hover:to-brand-700/50 transition">
              💼
            </div>
            <span className="text-brand-300 text-xs bg-brand-400/10 border border-brand-400/20 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Jobs</p>
          <p className="text-4xl font-bold text-white mt-1">
            {loading ? (
              <span className="inline-block w-8 h-8 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin"></span>
            ) : stats.totalJobs}
          </p>
          <p className="text-gray-600 text-xs mt-3 group-hover:text-brand-300 transition">
            View all jobs →
          </p>
        </div>

        {/* CVs Analyzed */}
        <div
          onClick={() => navigate('/candidates')}
          className="bg-surface-900 p-6 rounded-2xl border border-surface-700 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20 cursor-pointer transition group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-700/30 rounded-xl flex items-center justify-center text-2xl group-hover:from-green-500/50 group-hover:to-green-700/50 transition">
              📄
            </div>
            <span className="text-green-300 text-xs bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full">
              Analyzed
            </span>
          </div>
          <p className="text-gray-400 text-sm">All Candidates</p>
          <p className="text-4xl font-bold text-white mt-1">
            {loading ? (
              <span className="inline-block w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></span>
            ) : stats.totalCVs}
          </p>
          <p className="text-gray-600 text-xs mt-3 group-hover:text-green-300 transition">
            View all Candidates →
          </p>
        </div>

        {/* Recommended */}
        <div
          onClick={() => navigate('/recommended')}
          className="bg-surface-900 p-6 rounded-2xl border border-surface-700 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-900/20 cursor-pointer transition group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/30 to-amber-700/30 rounded-xl flex items-center justify-center text-2xl group-hover:from-amber-500/50 group-hover:to-amber-700/50 transition">
              ⭐
            </div>
            <span className="text-amber-300 text-xs bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-full">
              Shortlisted
            </span>
          </div>
          <p className="text-gray-400 text-sm">Recommended</p>
          <p className="text-4xl font-bold text-white mt-1">
            {loading ? (
              <span className="inline-block w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></span>
            ) : stats.recommended}
          </p>
          <p className="text-gray-600 text-xs mt-3 group-hover:text-amber-300 transition">
            View shortlisted →
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-surface-900 rounded-2xl border border-surface-700 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4 text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/jobs/new')}
            className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 p-4 rounded-xl font-semibold transition flex items-center gap-3 shadow-lg shadow-brand-900/30"
          >
            <span className="text-2xl">➕</span>
            <div className="text-left">
              <p className="font-semibold text-white">Create New Job</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-surface-800 hover:bg-surface-700 p-4 rounded-xl font-semibold transition flex items-center gap-3 border border-surface-700"
          >
            <span className="text-2xl">📋</span>
            <div className="text-left">
              <p className="font-semibold text-white">View All Jobs</p>
             </div>
          </button>
        </div>
      </div>

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <div className="bg-surface-900 rounded-2xl border border-surface-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-white">Recent Jobs 💼</h3>
            <button
              onClick={() => navigate('/jobs')}
              className="text-brand-400 text-sm hover:text-brand-300 transition"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentJobs.map(job => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="flex justify-between items-center p-4 bg-surface-800 rounded-xl hover:bg-surface-700 cursor-pointer transition border border-transparent hover:border-brand-600/30"
              >
                <div>
                  <p className="font-medium text-white">{job.title}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {job.experience_required} experience
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end max-w-xs">
                  {job.required_skills.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="bg-brand-500/10 text-brand-300 border border-brand-500/20 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.required_skills.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{job.required_skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-surface-900 rounded-2xl border border-surface-700 p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">How HireIQ Works 🤖</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '💼', title: 'Post Job', desc: 'Give job description' },
            { icon: '📤', title: 'Upload CV', desc: 'Upload Candidate Resume' },
            { icon: '🤖', title: 'AI Analysis', desc: 'Agents will analyze Resume' },
            { icon: '📊', title: 'Results', desc: 'Ranked candidates' },
          ].map((step, i) => (
            <div key={i} className="text-center p-4 bg-surface-800 rounded-xl border border-surface-700">
              <div className="text-3xl mb-2">{step.icon}</div>
              <p className="font-semibold text-sm text-white">{step.title}</p>
              <p className="text-gray-400 text-xs mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
