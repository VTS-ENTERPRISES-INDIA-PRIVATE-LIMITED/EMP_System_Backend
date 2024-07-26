const nodemailer = require('nodemailer')

require('dotenv').config()
const mail = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: 'surarapuvagdevi@gmail.com',
      pass: 'vqnx utjz yjac pasw'
    }
  }
)

module.exports = mail