const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  deleteJob 
} = require('../controllers/jobController')

// Sab routes protected hain
// Pehle login zaroori hai

// POST /api/jobs — Naya job banao
router.post('/', authMiddleware, createJob)

// GET /api/jobs — Sari jobs dekho
router.get('/', authMiddleware, getAllJobs)

// GET /api/jobs/:id — Ek job dekho
router.get('/:id', authMiddleware, getJobById)

// DELETE /api/jobs/:id — Job delete karo
router.delete('/:id', authMiddleware, deleteJob)

module.exports = router