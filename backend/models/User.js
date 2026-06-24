const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  
  // HR Manager ka naam
  name: {
    type: String,
    required: true
  },

  // Login ke liye email
  email: {
    type: String,
    required: true,
    unique: true  // Ek email ek baar hi ho sakta
  },

  // Password (baad mein encrypt hoga)
  password: {
    type: String,
    required: true
  },

  // Company ka naam
  company: {
    type: String,
    required: true
  }

}, { timestamps: true }) // createdAt, updatedAt automatic

module.exports = mongoose.model('User', userSchema)