const multer = require('multer')
const fs = require('fs')

// Uploads folder banao agar nahi hai
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  console.log('File mimetype:', file.mimetype)
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Sirf PDF files allowed hain!'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = upload