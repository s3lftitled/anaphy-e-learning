const UserModel = require('../models/user.model')
const EmailUtil = require('../utils/emailUtils')
const PasswordUtil = require('../utils/passwordUtils')
const HTTP_STATUS = require('../constants/httpConstants')
const mongoose = require('mongoose')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
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

const logIn = async (email, password) => {
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

const changePassword = async ( userId, currentPassword, newPassword, newPasswordConfirmation ) => {
  try {
    // Check all the required fields
    const requiredParams = { userId, currentPassword, newPassword, newPasswordConfirmation }
    const missingParams = findMissingParams(requiredParams)
    appAssert(!missingParams, 'Please fill in all the required fields', HTTP_STATUS.BAD_REQUEST)

     // Validate userId as a MongoDB ObjectId
     appAssert(
      mongoose.Types.ObjectId.isValid(userId),
      'Invalid user ID format',
      HTTP_STATUS.BAD_REQUEST
    )

    const user = await UserModel.findById(userId)
    appAssert(user, 'User is not found', HTTP_STATUS.BAD_REQUEST)

    // Validate that passwords are strings
    appAssert(
      typeof currentPassword === 'string' && 
      typeof newPassword === 'string' && 
      typeof newPasswordConfirmation === 'string',
      'Passwords must be strings',
      HTTP_STATUS.BAD_REQUEST
    )

    const isPasswordCorrect = await PasswordUtil.comparePassword(currentPassword, user.password)
    appAssert(isPasswordCorrect, 'Current password is incorrect, please try again', HTTP_STATUS.BAD_REQUEST)

    const isNewPasswordValid = await PasswordUtil.comparePassword(newPassword, user.password)
    appAssert(!isNewPasswordValid, 'New password cant be the same as your old password', HTTP_STATUS.BAD_REQUEST)

    appAssert(
      newPassword === newPasswordConfirmation,
      'New password and confirmation password do not match',
      HTTP_STATUS.BAD_REQUEST
    )

    const hashedPassword = await PasswordUtil.hashPassword(newPassword)

    user.password = hashedPassword
    await user.save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  registerUser,
  logIn,
  verifyEmail,
  changePassword,
}
