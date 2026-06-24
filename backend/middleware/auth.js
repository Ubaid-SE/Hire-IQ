const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    // 1. Token lo request header se
    const token = req.header('Authorization')?.replace('Bearer ', '')

    // 2. Token hai ya nahi check karo
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. Login required.' 
      })
    }

    // 3. Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. User ID request mein add karo
    req.userId = decoded.userId

    // 5. Aage jaane do
    next()

  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid token' 
    })
  }
}

module.exports = authMiddleware