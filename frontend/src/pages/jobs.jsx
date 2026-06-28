import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Jobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs')
      setJobs(res.data.jobs)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (e, jobId) => {
    e.stopPropagation()
    if (!confirm('Want to delete job?')) return
    try {
      await API.delete(`/jobs/${jobId}`)
      fetchJobs()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const toggleJobStatus = async (e, jobId, currentStatus) => {
    e.stopPropagation()
    const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active'
    
    try {
      await API.patch(`/jobs/${jobId}/status`, { status: newStatus })
      fetchJobs()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Jobs</h2>
          <p className="text-gray-400 text-sm mt-1">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
          </p>
        </div>
        <button
          onClick={() => navigate('/jobs/new')}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition font-semibold flex items-center gap-2"
        >
          ➕ New Job
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search job..."
          className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">💼</p>
          <p className="text-gray-400 text-lg">No job</p>
          <button
            onClick={() => navigate('/jobs/new')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl transition"
          >
            Create first job
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map(job => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 cursor-pointer transition group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-lg">
                      💼
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold group-hover:text-blue-400 transition">
                          {job.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          job.status === 'Active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {job.status === 'Active' ? '🟢 Active' : '🔴 Closed'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {job.experience_required} experience required
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap ml-13">
                    {job.required_skills.map(skill => (
                      <span
                        key={skill}
                        className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <span className="text-gray-500 text-xs">
                    📅 {new Date(job.createdAt).toLocaleDateString('en-PK')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => toggleJobStatus(e, job._id, job.status)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition border ${
                        job.status === 'Active'
                          ? 'bg-yellow-600/10 hover:bg-yellow-600 border-yellow-600/20 text-yellow-400 hover:text-white'
                          : 'bg-green-600/10 hover:bg-green-600 border-green-600/20 text-green-400 hover:text-white'
                      }`}
                    >
                      {job.status === 'Active' ? '⏸️ Close' : '▶️ Open'}
                    </button>
                    <button
                      onClick={(e) => deleteJob(e, job._id)}
                      className="bg-red-600/10 hover:bg-red-600 border border-red-600/20 text-red-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
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

export default Jobs