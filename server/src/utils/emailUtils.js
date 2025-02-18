const nodemailer = require('nodemailer')
const crypto = require('crypto')
const logger = require('../logger/logger')
require('dotenv').config()

class EmailUtil {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    })
  }

  async generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex')
  }

  async sendVerificationEmail(email, verificationCode) {
    try {
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      logger.error('Error sending verification email:', error.message)
      throw new Error('Failed to send verification email.')
    }
  }

  async sendConfirmationEmail(sanitizedEmail, confirmationLink) {
    try {

      const mailOptions = {
        from: process.env.USER,
        to: sanitizedEmail,
        subject: 'Teacher Account Confirmation',
        html: `
          <p>You have been added as a teacher to our system. Please confirm your account by clicking the link below:</p>
          <p><a href="${confirmationLink}" target="_blank">Confirm My Account</a></p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      logger.error('Error sending confirmation email:', error)
      throw new Error('Failed to send confirmation email.')
    }
  }
}

module.exports = new EmailUtil()