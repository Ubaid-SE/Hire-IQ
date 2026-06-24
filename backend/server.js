const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())

// Pehle static files
app.use('/uploads', express.static('uploads'))

// Phir JSON middleware
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected! ✅'))
  .catch((error) => console.log('MongoDB Error:', error))

// Routes
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')
const candidateRoutes = require('./routes/candidates')
const dashboardRoutes = require('./routes/dashboard')

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/candidates', candidateRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Test Route
app.get('/api', (req, res) => {
  res.json({ message: 'HireIQ Backend Chal Raha Hai! 🚀' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} pe`)
})