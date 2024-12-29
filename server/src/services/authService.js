const UserModel = require('../models/user.model')
const EmailUtil = require('../utils/emailUtils')
const PasswordUtil = require('../utils/passwordUtils')
const HTTP_STATUS = require('../constants/httpConstants')
const validator = require('validator')  // Using validator library for validation
const sanitizeHtml = require('sanitize-html')  // To sanitize input for XSS protection
const { findMissingParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')

const registerUser = async (email, password, passwordConfirmation) => {
  try {
    const requireParams = { email, password, passwordConfirmation }
    const missingParams = findMissingParams(requireParams)
    appAssert(!missingParams, 'Please fill in all the required fields', HTTP_STATUS.BAD_REQUEST)

    // Validate and sanitize email
    appAssert(validator.isEmail(email), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    const sanitizedEmail = sanitizeHtml(email.trim())  // Sanitize to remove potentially harmful HTML

    // Validate and sanitize password
    appAssert(password.length >= 8, 'Password must be at least 8 characters long', HTTP_STATUS.BAD_REQUEST)
    appAssert(password === passwordConfirmation, 'Passwords do not match', HTTP_STATUS.BAD_REQUEST)
    const sanitizedPassword = sanitizeHtml(password.trim())  // Sanitize to remove potentially harmful HTML

    // Check if email already exists
    const existingUser = await UserModel.exists({ email: sanitizedEmail })
    appAssert(!existingUser, 'Email already exists', HTTP_STATUS.CONFLICT)

    // Hash the password before saving (using PasswordUtil)
    const hashedPassword = await PasswordUtil.hashPassword(sanitizedPassword)

    // Send verification to user's email (using EmailUtil)
    const verificationCode = await EmailUtil.generateVerificationCode()

    // Send verification email
    await EmailUtil.sendVerificationEmail(sanitizedEmail, verificationCode)

    // Proceed with user creation, after sanitizing inputs
    await UserModel.create({
      email: sanitizedEmail,
      password: hashedPassword,
      verificationCode,
    })

  } catch (error) {
    throw error
  }
}

module.exports = {
  registerUser
}
