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

  // Skills preview
  const skillsPreview = form.required_skills
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            🧠
          </div>
          <h1 className="text-xl font-bold">HireIQ</h1>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition"
        >
          ← Dashboard
        </button>
      </nav>

      <div className="p-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">New Job Post ➕</h2>
          <p className="text-gray-400 mt-1">
            Job details bharo — AI candidates analyze karega
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Job Title */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <label className="text-gray-400 text-sm mb-2 block font-medium">
              💼 Job Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              placeholder="React Developer"
              required
            />
          </div>

          {/* Job Description */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <label className="text-gray-400 text-sm mb-2 block font-medium">
              📝 Job Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 h-36 resize-none"
              placeholder="Job ki responsibilities aur requirements detail mein likho..."
              required
            />
            <p className="text-gray-600 text-xs mt-2">
              {form.description.length} characters
            </p>
          </div>

          {/* Required Skills */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <label className="text-gray-400 text-sm mb-2 block font-medium">
              🛠️ Required Skills
            </label>
            <input
              type="text"
              value={form.required_skills}
              onChange={(e) => setForm({...form, required_skills: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              placeholder="React, Node.js, MongoDB, Express"
              required
            />
            <p className="text-gray-600 text-xs mt-2">
              Comma se alag karo
            </p>

            {/* Skills Preview */}
            {skillsPreview.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {skillsPreview.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience Required */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <label className="text-gray-400 text-sm mb-2 block font-medium">
              ⏳ Experience Required
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['Fresh', '1 year', '2 years', '3+ years'].map(exp => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setForm({...form, experience_required: exp})}
                  className={`p-2 rounded-xl text-sm transition border ${
                    form.experience_required === exp
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-blue-500'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.experience_required}
              onChange={(e) => setForm({...form, experience_required: e.target.value})}
              className="w-full bg-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              placeholder="Ya khud likho: 2 years"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Job ban rahi hai...
              </>
            ) : (
              <>
                ✨ Create Job Post
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  )
}

export default NewJob