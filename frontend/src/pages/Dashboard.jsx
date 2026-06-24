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

  useEffect(() => {
    fetchStats()
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">
            🧠
          </div>
          <h1 className="text-xl font-bold text-white">HireIQ</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
            <span className="text-gray-300 text-sm">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-400 mt-1">
            {user?.company} — AI Hiring Dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl">
                💼
              </div>
              <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-gray-400 text-sm">Total Jobs</p>
            <p className="text-4xl font-bold text-blue-400 mt-1">
              {loading ? (
                <span className="inline-block w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></span>
              ) : stats.totalJobs}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-green-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center text-2xl">
                📄
              </div>
              <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                Analyzed
              </span>
            </div>
            <p className="text-gray-400 text-sm">CVs Analyzed</p>
            <p className="text-4xl font-bold text-green-400 mt-1">
              {loading ? (
                <span className="inline-block w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></span>
              ) : stats.totalCVs}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl">
                ⭐
              </div>
              <span className="text-purple-400 text-xs bg-purple-400/10 px-2 py-1 rounded-full">
                Shortlisted
              </span>
            </div>
            <p className="text-gray-400 text-sm">Recommended</p>
            <p className="text-4xl font-bold text-purple-400 mt-1">
              {loading ? (
                <span className="inline-block w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></span>
              ) : stats.recommended}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/jobs/new')}
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold transition flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              <div className="text-left">
                <p className="font-semibold">New Job Post</p>
                <p className="text-blue-200 text-xs">Job create karo</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/jobs')}
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl font-semibold transition flex items-center gap-3 border border-gray-700"
            >
              <span className="text-2xl">📋</span>
              <div className="text-left">
                <p className="font-semibold">View All Jobs</p>
                <p className="text-gray-400 text-xs">Sari jobs dekho</p>
              </div>
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-6 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="font-semibold text-lg mb-4">How HireIQ Works 🤖</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: '💼', title: 'Job Post', desc: 'Job description likho' },
              { icon: '📤', title: 'CV Upload', desc: 'Candidate CVs upload karo' },
              { icon: '🤖', title: 'AI Analysis', desc: 'Agents CV analyze karen' },
              { icon: '📊', title: 'Results', desc: 'Ranked candidates dekho' },
            ].map((step, i) => (
              <div key={i} className="text-center p-4 bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">{step.icon}</div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-gray-400 text-xs mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard