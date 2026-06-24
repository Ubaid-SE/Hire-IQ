const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register — Naya HR Manager banana
const register = async (req, res) => {
  try {
    // 1. Request se data lo
    const { name, email, password, company } = req.body

    // 2. Check karo email pehle se hai ya nahi
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      })
    }

    // 3. Password encrypt karo
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Naya user banao
    const user = new User({
      name,
      email,
      password: hashedPassword,
      company
    })

    // 5. Database mein save karo
    await user.save()

    // 6. Success response bhejo
    res.status(201).json({ 
      message: 'Account created successfully!' 
    })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Login — HR Manager login karna
const login = async (req, res) => {
  try {
    // 1. Request se data lo
    const { email, password } = req.body

    // 2. User dhundo database mein
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ 
        message: 'Email not found' 
      })
    }

    // 3. Password check karo
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Wrong password' 
      })
    }

    // 4. JWT Token banao
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. Token bhejo
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company
      }
    })

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

module.exports = { register, login }