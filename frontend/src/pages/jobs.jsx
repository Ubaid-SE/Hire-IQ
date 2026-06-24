import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Jobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

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
    if (!confirm('Job delete karna chahte ho?')) return
    try {
      await API.delete(`/jobs/${jobId}`)
      fetchJobs()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">HireIQ</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
          ← Dashboard
        </button>
      </nav>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Jobs</h2>
          <button
            onClick={() => navigate('/jobs/new')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            + New Job
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-400">Koi job nahi mili. Pehle job banao!</p>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 cursor-pointer transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{job.experience_required} experience</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {job.required_skills.map(skill => (
                        <span key={skill} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-500 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => deleteJob(e, job._id)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs px-3 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs