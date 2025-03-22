const UserModel = require('../models/user.model')
const UserActivityModel = require('../models/user-activity.model')
const TeacherModel = require('../models/teacher.model')
const EmailUtil = require('../utils/emailUtils')
const PasswordUtil = require('../utils/passwordUtils')
const HTTP_STATUS = require('../constants/httpConstants')
const mongoose = require('mongoose')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const { generateTokens } = require('../middlewares/jsonWebTokens')
const logger = require('../logger/logger')
const axios = require('axios')

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET

const verifyCaptcha = async (recaptcha) => {
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: {
        secret: CAPTCHA_SECRET,
        response: recaptcha,
      },
    }
  )
  return response.data.success
}

const registerUser = async (name, email, password, passwordConfirmation, recaptcha) => {
  try {
    validateRequiredParams({ name, email, password, passwordConfirmation, recaptcha })

    //captcha
    appAssert(await verifyCaptcha(recaptcha), 'Invalid CAPTCHA', HTTP_STATUS.BAD_REQUEST)

    // Validate and sanitize email
    appAssert(validator.isEmail(email), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    const sanitizedEmail = sanitizeHtml(email.trim())  // Sanitize to remove potentially harmful HTML

    // Validate and sanitize name
    appAssert(name.length >= 6 && name.length <= 35, 'Name must be longer than 6 characters and shorter than 35', HTTP_STATUS.BAD_REQUEST)
    const sanitizedName = sanitizeHtml(name.trim())

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
      name: sanitizedName,
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
    validateRequiredParams({ email, verificationCode })

    //captcha 
    // appAssert(await verifyCaptcha(captchaToken), 'Invalid CAPTCHA'. HTTP_STATUS.BAD_REQUEST)
    
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

const updateUserActivity = async (userId, userType) => {
  try {
    // Find or create activity record for this user
    await UserActivityModel.findOneAndUpdate(
      { userId, userType },
      { 
        userId,
        userType,
        lastLogin: new Date(),
        $inc: { loginCount: 1 } // Increment login count
      },
      { upsert: true, new: true }
    )
  } catch (error) {
    logger.error('Error updating user activity:', error)
    // Don't throw - we don't want analytics to break the main flow
  }
}

const logIn = async (email, password) => {
  try {
    // Check all the required fields
   validateRequiredParams({ email, password })

    // Validate and sanitize email
    appAssert(validator.isEmail(email), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    const sanitizedEmail = sanitizeHtml(email.trim())  // Sanitize to remove potentially harmful HTML

    // Find the user associated with the email
    let user = await UserModel.findOne({ email: sanitizedEmail })

    if (!user) {
      user = await TeacherModel.findOne({ email: sanitizedEmail })
    }
    appAssert(user, 'No user is associated with that email', HTTP_STATUS.BAD_REQUEST)

    appAssert(user.verificationCode === null, 'Please verify your email first', HTTP_STATUS.FORBIDDEN)

    // Check if the password is correct (using PasswordUtil class)
    const isPasswordCorrect = await PasswordUtil.comparePassword(password, user.password)
    appAssert(isPasswordCorrect, 'Incorrect password, please try again', HTTP_STATUS.BAD_REQUEST)

    await updateUserActivity(user._id, user.role)

    const tokens = generateTokens(user)

    const { accessToken, refreshToken } = tokens

    return { user, accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

const changePassword = async ( userId, currentPassword, newPassword, newPasswordConfirmation ) => {
  try {
    // Check all the required fields
    validateRequiredParams({ userId, currentPassword, newPassword, newPasswordConfirmation })

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

const logOutService = async (res) => {
  try {
    validateRequiredParams({ res })
    res.clearCookie('refreshToken')
  } catch (error) {
    throw error
  }
}

module.exports = {
  registerUser,
  logIn,
  verifyEmail,
  changePassword,
  logOutService,
}
