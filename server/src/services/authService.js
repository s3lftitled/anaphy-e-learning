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
    const requiredParams = { email, password, passwordConfirmation }
    const missingParams = findMissingParams(requiredParams)
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

const verifyEmail = async(email, verificationCode) => {
  try {
    // Check all the required fields
    const requiredParams = { email, verificationCode }
    const missingParams = findMissingParams(requiredParams)
    appAssert(!missingParams, 'Please fill in all the required fields', HTTP_STATUS.BAD_REQUEST)
    
    // Validate and sanitize email
    appAssert(validator.isEmail(email), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    const sanitizedEmail = sanitizeHtml(email.trim())  // Sanitize to remove potentially harmful HTML

    // Find the user associated with the email
    const user = await UserModel.findOne({ email: sanitizedEmail })
    appAssert(user, 'No user is associated with that email', HTTP_STATUS.BAD_REQUEST)

    appAssert(verificationCode === user.verificationCode, 'Verification code is incorrect', HTTP_STATUS.BAD_REQUEST)

    // Update user verification status
    user.verified = true
    user.verificationCode = null
    await user.save()

  } catch (error) {
    throw error
  }
}

const logIn = async(email, password) => {
  try {
    // Check all the required fields
    const requiredParams = { email, password }
    const missingParams = findMissingParams(requiredParams)
    appAssert(!missingParams, 'Please fill in all the required fields', HTTP_STATUS.BAD_REQUEST)

    // Validate and sanitize email
    appAssert(validator.isEmail(email), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    const sanitizedEmail = sanitizeHtml(email.trim())  // Sanitize to remove potentially harmful HTML

    // Find the user associated with the email
    const user = await UserModel.findOne({ email: sanitizedEmail })
    appAssert(user, 'No user is associated with that email', HTTP_STATUS.BAD_REQUEST)

    // Check if the password is correct (using PasswordUtil class)
    const isPasswordCorrect = await PasswordUtil.comparePassword(password, user.password)
    appAssert(isPasswordCorrect, 'Incorrect password, please try again', HTTP_STATUS.BAD_REQUEST)

    return user
  } catch (error) {
    throw error
  }
}

module.exports = {
  registerUser,
  logIn,
  verifyEmail
}
