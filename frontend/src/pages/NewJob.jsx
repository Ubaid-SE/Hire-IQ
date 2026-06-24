import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function NewJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    required_skills: '',
    experience_required: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/jobs', {
        ...form,
        required_skills: form.required_skills.split(',').map(s => s.trim())
      })
      navigate('/jobs')
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
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
          ← Dashboard
        </button>
      </nav>

      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">New Job Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Job Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React Developer"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Job Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Job description likho..."
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Required Skills (comma separated)</label>
            <input
              type="text"
              value={form.required_skills}
              onChange={(e) => setForm({...form, required_skills: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, Node.js, MongoDB"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Experience Required</label>
            <input
              type="text"
              value={form.experience_required}
              onChange={(e) => setForm({...form, experience_required: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2 years"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewJob