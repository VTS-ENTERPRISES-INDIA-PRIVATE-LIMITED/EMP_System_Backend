const nodemailer = require('nodemailer')

require('dotenv').config()
const mail = nodemailer.createTransport(
  {
    service: 'gmail',
    secure : true,
    pool : true,
    auth: {
      user: 'surarapuvagdevi@gmail.com',
      pass: 'vqnx utjz yjac pasw'
    }
  }
)

module.exports = mail