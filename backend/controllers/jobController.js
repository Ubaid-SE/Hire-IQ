const Job = require('../models/Job')

// Naya job banana
const createJob = async (req, res) => {
  try {
    const { title, description, required_skills, experience_required } = req.body

    const job = new Job({
      title,
      description,
      required_skills,
      experience_required,
      created_by: req.userId  // Middleware se aata hai
    })

    await job.save()

    res.status(201).json({
      message: 'Job created successfully!',
      job
    })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Sari jobs dekhna
const getAllJobs = async (req, res) => {
  try {
    // Sirf us HR manager ki jobs jo logged in hai
    const jobs = await Job.find({ created_by: req.userId })

    res.json({ jobs })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Ek job dekhna
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      })
    }

    res.json({ job })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Job status update karna (Active/Closed)
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body

    // Status validation
    if (!['Active', 'Closed'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Use Active or Closed' 
      })
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      })
    }

    res.json({
      message: `Job status updated to ${status}!`,
      job
    })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Job delete karna
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id)

    res.json({ message: 'Job deleted successfully!' })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

module.exports = { createJob, getAllJobs, getJobById, deleteJob, updateJobStatus }