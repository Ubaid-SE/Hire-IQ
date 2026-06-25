const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/upload')
const Candidate = require('../models/Candidate')
const { 
  uploadCV,
  uploadBulkCV,
  getCandidates,
  getCandidateById,
  getAllCandidates,
  getRecommendedCandidates
} = require('../controllers/candidateController')

// Specific routes PEHLE (important!)
router.get('/all', authMiddleware, getAllCandidates)
router.get('/recommended', authMiddleware, getRecommendedCandidates)
router.get('/job/:jobId', authMiddleware, getCandidates)

// Upload routes
router.post('/upload', authMiddleware, upload.single('cv'), uploadCV)
router.post('/upload-bulk', authMiddleware, upload.array('cvs', 10), uploadBulkCV)

// Dynamic routes BAAD MEIN
router.get('/:id', authMiddleware, getCandidateById)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id)
    res.json({ message: 'Candidate deleted!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router