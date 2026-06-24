const Candidate = require('../models/Candidate')
const Job = require('../models/Job')
const axios = require('axios')
const path = require('path')

// CV Upload karna
const uploadCV = async (req, res) => {
  try {
    console.log('Body:', req.body)
    console.log('File:', req.file)

    if (!req.file) {
      return res.status(400).json({ 
        message: 'CV file required hai!' 
      })
    }

    const job = await Job.findById(req.body.job_id)
    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      })
    }

    const candidate = new Candidate({
      job_id: req.body.job_id,
      cv_file: req.file.path,
      name: '',
      email: ''
    })

    await candidate.save()

    // Absolute path banao
    const absolutePdfPath = path.join(__dirname, '..', req.file.path)
    console.log('PDF Path:', absolutePdfPath)

    const agentResponse = await axios.post('http://localhost:5001/process', {
      pdf_path: absolutePdfPath,
      job_data: {
        title: job.title,
        description: job.description,
        required_skills: job.required_skills,
        experience_required: job.experience_required,
        company: 'HireIQ'
      }
    })

    const result = agentResponse.data.result

    candidate.name = result.candidate_info.name || ''
    candidate.email = result.candidate_info.email || ''
    candidate.parsed_data = result.candidate_info
    candidate.match_analysis = result.match_analysis
    candidate.overall_score = result.score.overall_score
    candidate.recommendation = result.score.recommendation
    candidate.interview_questions = [
      ...result.interview_questions.technical_questions,
      ...result.interview_questions.experience_questions,
      ...result.interview_questions.behavioral_questions
    ]
    candidate.email_draft = result.email_draft.body

    await candidate.save()

    res.status(201).json({
      message: 'CV processed successfully!',
      candidate
    })

  } catch (error) {
    console.log('Error:', error.message)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Job ke candidates dekhna
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ 
      job_id: req.params.jobId 
    }).sort({ overall_score: -1 })

    res.json({ candidates })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Ek candidate ki detail
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)

    if (!candidate) {
      return res.status(404).json({ 
        message: 'Candidate not found' 
      })
    }

    res.json({ candidate })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

module.exports = { uploadCV, getCandidates, getCandidateById }