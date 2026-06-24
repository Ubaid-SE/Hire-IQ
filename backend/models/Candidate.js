const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({

  // Kis job ke liye apply kiya
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  // Candidate ka naam
  name: {
    type: String,
    default: ''
  },

  // Candidate ki email
  email: {
    type: String,
    default: ''
  },

  // CV file ka path
  cv_file: {
    type: String,
    required: true
  },

  // Agent ne jo data nikala CV se
  parsed_data: {
    type: Object,
    default: {}
  },

  // Job se match analysis
  match_analysis: {
    type: Object,
    default: {}
  },

  // Final score 0-100
  overall_score: {
    type: Number,
    default: 0
  },

  // Recommended / Not Recommended
  recommendation: {
    type: String,
    default: ''
  },

  // Interview questions
  interview_questions: {
    type: [String],
    default: []
  },

  // Email draft
  email_draft: {
    type: String,
    default: ''
  }

}, { timestamps: true })

module.exports = mongoose.model('Candidate', candidateSchema)