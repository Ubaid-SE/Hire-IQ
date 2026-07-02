import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'
import logo from '../assets/ai.png'


function BulkUpload() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const handleFiles = (selectedFiles) => {
    const pdfs = Array.from(selectedFiles).filter(
      f => f.type === 'application/pdf'
    )
    if (pdfs.length !== selectedFiles.length) {
      alert('Only PDF files are allowed!')
    }
    setFiles(prev => [...prev, ...pdfs])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!isPremium) {
      setShowPremiumModal(true)
      return
    }
    if (files.length === 0) return alert('Select some CVs to upload!')
    setLoading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('cvs', file))
      formData.append('job_id', jobId)

      const res = await API.post('/candidates/upload-bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total))
        }
      })

      setResults(res.data)
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <p className="text-5xl mb-4">👑</p>
              <h3 className="text-2xl font-bold text-white mb-2">Premium Feature</h3>
              <p className="text-gray-400 text-sm">
                Bulk CV Upload is available for Premium users only. Upgrade to process multiple CVs at once with AI.
              </p>
            </div>

            {/* Features */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6 space-y-3">
              <p className="text-yellow-400 font-semibold text-sm mb-3">✨ Premium includes:</p>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-green-400">✓</span> Bulk CV Upload (up to 50 CVs)
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-green-400">✓</span> Priority AI Processing
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-green-400">✓</span> Advanced Analytics & Reports
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-green-400">✓</span> Unlimited Job Postings
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">Starting at</p>
              <p className="text-4xl font-bold text-white">$29<span className="text-lg text-gray-400">/mo</span></p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsPremium(true)
                  setShowPremiumModal(false)
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold p-4 rounded-xl transition"
              >
                👑 Upgrade to Premium
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 p-3 rounded-xl transition text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-gray-900 px-8 py-1 flex justify-between items-center border-b border-gray-800">
       {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 mb-8">
              <div className="w-15 h-15 rounded-xl overflow-hidden border border-brand-500/30 shadow-lg shadow-brand-900/50 shrink-0">
                <img src={logo} alt="Hire IQ" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Hire IQ</span>
            </div>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
      </nav>

      <div className="p-8 max-w-3xl mx-auto">

        {!results ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Bulk CV Upload 📦</h2>
                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs px-3 py-1 rounded-full font-semibold">
                  👑 Premium
                </span>
              </div>
              <p className="text-gray-400 mt-1">
                Upload multiple CV at a time — AI will analyze!
              </p>
            </div>

            {/* Premium Banner */}
            {!isPremium && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">👑</span>
                  <div>
                    <p className="font-semibold text-yellow-400">Premium Feature</p>
                    <p className="text-gray-400 text-sm">Upgrade to unlock Bulk CV Upload</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-xl transition text-sm"
                >
                  Upgrade
                </button>
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                if (!isPremium) { setShowPremiumModal(true); return }
                handleFiles(e.dataTransfer.files)
              }}
              onClick={() => {
                if (!isPremium) { setShowPremiumModal(true); return }
                document.getElementById('bulkInput').click()
              }}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition mb-6 relative ${
                !isPremium
                  ? 'border-gray-700 opacity-50'
                  : dragOver
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/5'
              }`}
            >
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10">
                  <span className="text-4xl">🔒</span>
                </div>
              )}
              <input
                id="bulkInput"
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <p className="text-5xl mb-4">📂</p>
              <p className="text-gray-300 font-semibold text-lg">
                Drag & Drop multiple CV here
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Or Click To Choose
              </p>
              <p className="text-gray-600 text-xs mt-3">
                Max 10 PDFs — Each file max 5MB
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">
                    Selected CVs
                    <span className="ml-2 bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                      {files.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setFiles([])}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Remove All
                  </button>
                </div>

                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-800 p-3 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📄</span>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-gray-500 text-xs">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Progress */}
            {loading && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Processing CVs...</p>
                  <p className="text-blue-400 text-sm">{progress}%</p>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                      <span className="text-gray-400">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading || files.length === 0}
              className={`w-full font-semibold p-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-3 ${
                isPremium
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-black'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AI is Analyzing... ({files.length} CVs)
                </>
              ) : isPremium ? (
                <>🚀 {files.length} Upload CVs & Analyze</>
              ) : (
                <>👑 Upgrade to Premium to Upload</>
              )}
            </button>
          </>
        ) : (
          // Results
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Results 🎉</h2>
              <button
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm transition"
              >
                Job Detail →
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 text-center">
                <p className="text-3xl font-bold text-blue-400">{results.total}</p>
                <p className="text-gray-400 text-sm mt-1">Total CVs</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 text-center">
                <p className="text-3xl font-bold text-green-400">{results.successful}</p>
                <p className="text-gray-400 text-sm mt-1">Successful</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 text-center">
                <p className="text-3xl font-bold text-red-400">{results.failed}</p>
                <p className="text-gray-400 text-sm mt-1">Failed</p>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-3">
              {results.results.map((r, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/candidates/${r.candidate.id}`)}
                  className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-500/50 cursor-pointer transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{r.candidate.name}</p>
                      <p className="text-gray-500 text-xs mt-1">📄 {r.file}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(r.candidate.score)}`}>
                        {r.candidate.score}%
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getBadgeStyle(r.candidate.recommendation)}`}>
                        {r.candidate.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Errors */}
            {results.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <h3 className="text-red-400 font-semibold mb-2">❌ Failed CVs</h3>
                {results.errors.map((e, i) => (
                  <p key={i} className="text-gray-400 text-sm">
                    {e.file}: {e.error}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => { setResults(null); setFiles([]) }}
              className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition"
            >
              📦 Upload more CVs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkUpload