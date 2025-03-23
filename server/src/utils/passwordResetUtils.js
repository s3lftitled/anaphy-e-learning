const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config()

// Generate reset token
const generateResetToken = (user) => {
  // Generate a random token using crypto
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Set expiration time for the token (e.g., 1 hour)
  const expirationTime = new Date()
  expirationTime.setHours(expirationTime.getHours() + 1)

  // Save token and expiration time to the user object
  user.resetPasswordToken = resetToken
  user.resetPasswordExpires = expirationTime

  return resetToken
}

// Send reset password email
const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    // Create a transporter using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
      },
    })

    // Construct the reset password email
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n`
        + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
        + `${process.env.RESET_PASSWORD_URL}/${resetToken}\n\n`
        + `If you did not request this, please ignore this email and your password will remain unchanged.\n\n`
        + `IMPORTANT: Do not share this link with anyone else. It is unique to your account and should be kept confidential.`,
    }
    
    // Send the email
    await transporter.sendMail(mailOptions)
  } catch (error) {
    // Handle errors and throw an error for the caller to handle
    console.error('Error sending reset password email:', error.message)
    throw new Error('Failed to send reset password email.')
  }
}

module.exports = { generateResetToken, sendResetPasswordEmail }