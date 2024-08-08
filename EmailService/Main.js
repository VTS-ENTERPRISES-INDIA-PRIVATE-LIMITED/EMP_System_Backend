const nodemailer = require('nodemailer')

require('dotenv').config()
const mail = nodemailer.createTransport(
  {
    service: 'gmail',
    secure : true,
    pool : true,
    auth: {
      user: 'tempabc70759@gmail.com',
      pass: 'tmgagytlxgkvkgfp'
    }
  }
)

module.exports = mail