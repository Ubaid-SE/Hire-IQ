const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/upload')
const Candidate = require('../models/Candidate')
const { 
  uploadCV, 
  getCandidates,
  getCandidateById
} = require('../controllers/candidateController')

// POST /api/candidates/upload — CV upload karo
router.post('/upload', authMiddleware, upload.single('cv'), uploadCV)

// GET /api/candidates/job/:jobId — Job ke candidates
router.get('/job/:jobId', authMiddleware, getCandidates)

// GET /api/candidates/:id — Ek candidate
router.get('/:id', authMiddleware, getCandidateById)

// DELETE /api/candidates/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id)
    res.json({ message: 'Candidate deleted!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router