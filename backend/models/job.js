const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({

  // Job ka title
  title: {
    type: String,
    required: true
  },

  // Job ki description
  description: {
    type: String,
    required: true
  },

  // Required skills array mein
  required_skills: {
    type: [String],
    required: true
  },

  // Kitne saal experience chahiye
  experience_required: {
    type: String,
    required: true
  },

  // Konse HR manager ne banaya
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema)