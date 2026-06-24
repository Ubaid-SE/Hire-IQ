const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const Job = require('../models/Job')
const Candidate = require('../models/Candidate')

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Fix — req.userId use karo
    const totalJobs = await Job.countDocuments({ 
      created_by: req.userId 
    })

    // Us user ki jobs ki IDs nikalo
    const userJobs = await Job.find({ 
      created_by: req.userId 
    }).select('_id')

    const jobIds = userJobs.map(j => j._id)

    // Sirf us user ke candidates
    const totalCVs = await Candidate.countDocuments({ 
      job_id: { $in: jobIds } 
    })

    const recommended = await Candidate.countDocuments({
      job_id: { $in: jobIds },
      recommendation: { 
        $in: ['Recommended', 'Highly Recommended'] 
      }
    })

    res.json({ totalJobs, totalCVs, recommended })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
})

module.exports = router