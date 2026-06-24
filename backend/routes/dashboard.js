const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const Job = require('../models/Job')
const Candidate = require('../models/Candidate')

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ created_by: req.user.userId })
    const totalCVs = await Candidate.countDocuments()
    const recommended = await Candidate.countDocuments({
      recommendation: { $in: ['Recommended', 'Highly Recommended'] }
    })

    res.json({ totalJobs, totalCVs, recommended })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router