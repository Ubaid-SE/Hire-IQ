import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'
import jsPDF from 'jspdf'
import logo from '../assets/ai.png'


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

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.text('HireIQ Candidates Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    // Job Info
    doc.setFontSize(12)
    doc.text(`Job: ${job?.title}`, 20, yPosition)
    yPosition += 7
    doc.setFontSize(10)
    doc.text(`Experience Required: ${job?.experience_required}`, 20, yPosition)
    yPosition += 7
    doc.text(`Total Candidates: ${candidates.length}`, 20, yPosition)
    yPosition += 12

    // Table Header
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    doc.text('Rank', 20, yPosition)
    doc.text('Name', 40, yPosition)
    doc.text('Email', 100, yPosition)
    doc.text('Score', 160, yPosition)
    doc.text('Recommendation', 180, yPosition)
    yPosition += 8

    // Table Data
    doc.setFont(undefined, 'normal')
    candidates.forEach((candidate, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(9)
      doc.text(`${index + 1}`, 20, yPosition)
      doc.text(candidate.name, 40, yPosition)
      doc.text(candidate.email, 100, yPosition)
      doc.text(`${candidate.overall_score}%`, 160, yPosition)
      
      const recText = candidate.recommendation === 'Highly Recommended' ? '✓ Highly Rec.' : 
                      candidate.recommendation === 'Recommended' ? '✓ Recommended' : '✗ Not Rec.'
      doc.text(recText, 180, yPosition)
      yPosition += 8
    })

    // Footer
    yPosition += 5
    doc.setFontSize(8)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10)

    // Download
    doc.save(`${job?.title}_candidates.pdf`)
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBadgeStyle = (recommendation) => {
    if (recommendation === 'Highly Recommended')
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    if (recommendation === 'Recommended')
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    return 'bg-red-500/20 text-red-400 border border-red-500/30'
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 px-8 py-1 flex justify-between items-center border-b border-gray-800">
        {/* Logo */}
             <div className="flex items-center gap-2.5 px-2 mb-8">
               <div className="w-9 h-9 rounded-xl overflow-hidden border border-brand-500/30 shadow-lg shadow-brand-900/50 shrink-0">
                 <img src={logo} alt="Hire IQ" className="w-full h-full object-cover" />
               </div>
               <span className="text-white font-bold text-lg tracking-tight">Hire IQ</span>
             </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/jobs')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Jobs
          </button>
          {candidates.length > 0 && (
            <button
              onClick={exportToPDF}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition font-semibold"
            >
              📥 Export PDF
            </button>
          )}
        </div>
      </nav>

      <div className="p-8 max-w-5xl mx-auto">

        {/* Job Card */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl">
                  💼
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{job?.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {job?.experience_required} experience required
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 ml-15">
                {job?.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                {job?.required_skills?.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => navigate(`/jobs/${jobId}/upload`)}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition font-semibold whitespace-nowrap"
              >
                📤 Single CV
              </button>
              <button
                onClick={() => navigate(`/jobs/${jobId}/bulk-upload`)}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl transition font-semibold whitespace-nowrap"
              >
                📦 Bulk Upload
              </button>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Candidates
            <span className="ml-2 bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full">
              {candidates.length}
            </span>
          </h3>

          {candidates.length > 0 && (
            <p className="text-gray-400 text-sm">
              Sorted According to Score⬇️
            </p>
          )}
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-5xl mb-4">📄</p>
            <p className="text-gray-400 text-lg">No Candidate</p>
            <p className="text-gray-500 text-sm mb-4">Upload CV for Analysis</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(`/jobs/${jobId}/upload`)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl transition"
              >
                📤 Single CV
              </button>
              <button
                onClick={() => navigate(`/jobs/${jobId}/bulk-upload`)}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl transition"
              >
                📦 Bulk Upload
              </button>
            </div>
          </div>

        ) : (
          <div className="grid gap-3">
            {candidates.map((c, index) => (
              <div
                key={c._id}
                onClick={() => navigate(`/candidates/${c._id}`)}
                className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-500/50 cursor-pointer transition group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-800 text-gray-500'}`}
                    >
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
                    {/* Score Bar */}
                    <div className="hidden sm:block w-32">
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            c.overall_score >= 70 ? 'bg-green-500' :
                            c.overall_score >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${c.overall_score}%` }}
                        ></div>
                      </div>
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
    </div>
  )
}

export default JobDetail