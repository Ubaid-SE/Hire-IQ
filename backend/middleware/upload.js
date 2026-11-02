const multer = require('multer')

// Vercel pe disk writable nahi hoti, isliye file memory (RAM) me rakhte hain
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  console.log('File mimetype:', file.mimetype)
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF Files Allowed!'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB (Vercel 4.5MB body limit + base64 overhead)
})

module.exports = upload