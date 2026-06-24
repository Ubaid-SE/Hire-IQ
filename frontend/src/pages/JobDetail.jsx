import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function JobDetail() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [jobRes, candidatesRes] = await Promise.all([
        API.get(`/jobs/${jobId}`),
        API.get(`/candidates/job/${jobId}`)
      ])
      setJob(jobRes.data.job)
      setCandidates(candidatesRes.data.candidates)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">HireIQ</h1>
        <button onClick={() => navigate('/jobs')} className="text-gray-400 hover:text-white transition">
          ← Jobs
        </button>
      </nav>

      <div className="p-8">
        {/* Job Info */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{job?.title}</h2>
              <p className="text-gray-400 mt-1">{job?.experience_required} experience required</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {job?.required_skills?.map(skill => (
                  <span key={skill} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 mt-3 text-sm">{job?.description}</p>
            </div>
            <button
              onClick={() => navigate(`/jobs/${jobId}/upload`)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition whitespace-nowrap"
            >
              + Upload CV
            </button>
          </div>
        </div>

        {/* Candidates */}
        <h3 className="text-xl font-bold mb-4">Candidates ({candidates.length})</h3>

        {candidates.length === 0 ? (
          <p className="text-gray-400">Koi candidate nahi — CV upload karo!</p>
        ) : (
          <div className="grid gap-4">
            {candidates.map(c => (
              <div
                key={c._id}
                onClick={() => navigate(`/candidates/${c._id}`)}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 cursor-pointer transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{c.name}</h4>
                    <p className="text-gray-400 text-sm">{c.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">{c.overall_score}%</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      c.recommendation === 'Highly Recommended'
                        ? 'bg-green-500/20 text-green-400'
                        : c.recommendation === 'Recommended'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {c.recommendation}
                    </span>
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

export default JobDetail