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

  async sendMessageToStudent(teacherEmail, studentEmail, subject, message) {
    try {
      const mailOptions = {
        from: process.env.USER,
        to: studentEmail,
        cc: teacherEmail,  // Adding teacher's email as CC
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <p>${message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This message was sent by ${teacherEmail}</p>
          </div>
        `
      }
  
      await this.transporter.sendMail(mailOptions)
      return { success: true }
    } catch (error) {
      logger.error('Error sending message to student:', error)
      throw new Error('Failed to send message to student.')
    }
  }

  async sendResolutionEmail (email, title) {
    try {
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: `Your issue "${title}" has been resolved`,
        text: `Hello,\n\nYour issue "${title}" has been resolved. If you have further concerns, feel free to reach out.\n\nThank you!`
      }
  
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      logger.error('Error sending resolution email:', error)
      throw new Error('Error sending resolution email')
    }
  }

  async sendContactMessage(email, sanitizedSubject, sanitizedMessage) {
    try {
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: `Regarding your ticket: "${sanitizedSubject}"`,
        text: sanitizedMessage
      }
  
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      logger.error('Error sending contact email:', error)
      throw new Error('Error sending contact email')
    }
  }  

}

module.exports = new EmailUtil()