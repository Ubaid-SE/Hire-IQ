const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// MongoDB Connection (serverless ke liye cached)
let cached = global._mongoose
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

// Har request se pehle DB connected hona chahiye
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.log('MongoDB Error:', error)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

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

// Local run ke liye (Vercel pe ye nahi chalta)
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server chal raha hai port ${PORT} pe`)
  })
}

// Vercel isi export ko uthata hai
module.exports = app