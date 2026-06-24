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
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">HireIQ</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">👋 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Jobs</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">
              {loading ? '...' : stats.totalJobs}
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">CVs Analyzed</p>
            <p className="text-3xl font-bold text-green-400 mt-1">
              {loading ? '...' : stats.totalCVs}
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Recommended</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">
              {loading ? '...' : stats.recommended}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/jobs/new')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            + New Job Post
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            View All Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard