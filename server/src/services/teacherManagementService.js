const TeacherModel = require('../models/teacher.model')
const EmailUtil = require('../utils/emailUtils')
const crypto = require('crypto')
const sanitizeHtml = require('sanitize-html')
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const validator = require('validator')
const HTTP_STATUS = require('../constants/httpConstants')
const bcrypt = require('bcrypt')

const createTeacherAccount = async (email) => {
  try {
    validateRequiredParams(email)

    // Validate and sanitize email
    appAssert(validator.isEmail(email), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    const sanitizedEmail = sanitizeHtml(email.trim())  

    // Check if the teacher already exists
    const existingUser = await TeacherModel.exists({ email: sanitizedEmail })
    appAssert(!existingUser, 'Teacher email already exists', HTTP_STATUS.CONFLICT)

    // Generate a unique token for email confirmation
    const confirmationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000 // Token valid for 24 hours

    // Create the teacher account with status "pending"
    const teacher = await TeacherModel.create({
      email: sanitizedEmail,
      status: 'pending',
      confirmationToken: confirmationToken,
      tokenExpires: tokenExpiration
    })

    // Send confirmation email with the token
    const confirmationLink = `http://localhost:5173/confirm-teacher-account?token=${encodeURIComponent(confirmationToken)}&id=${encodeURIComponent(teacher._id)}`;
    await EmailUtil.sendConfirmationEmail(sanitizedEmail, confirmationLink)
   
    return teacher
  } catch (error) {
    throw error
  }
}

const completeTeacherAccount = async (id, token, name, password) => {
  try {
    validateRequiredParams(id, token, name, password)

    appAssert(validator.isMongoId(id), 'Invalid teacher ID format', HTTP_STATUS.BAD_REQUEST)

    const teacher = await TeacherModel.findOne({ _id: id, confirmationToken: token })
    appAssert(teacher, 'Invalid or expired token', HTTP_STATUS.BAD_REQUEST)

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update teacher info and activate account
    teacher.name = name
    teacher.password = hashedPassword
    teacher.status = 'active'
    teacher.confirmationToken = null  // Remove token after use
    await teacher.save()

    return { message: 'Account setup complete. You can now log in!' }
  } catch (error) {
    throw error
  }
}

const fetchTeacherAccounts = async () => {
  try {
    const teachers = await TeacherModel.find({}, 'email status createdAt')
    console.log(teachers)
    return teachers
  } catch (error) {
    throw error
  }
}

const deleteTeacherAccount = async (teacherId) => {
  try {
    // Validate if teacherId is provided
    validateRequiredParams({ teacherId })

    // Check if the provided teacherId is a valid MongoDB ObjectId
    appAssert(validator.isMongoId(teacherId), 'Invalid teacher ID format', HTTP_STATUS.BAD_REQUEST)

    // Find the teacher by ID
    const teacher = await TeacherModel.findById(teacherId);
    appAssert(teacher, 'Teacher not found', HTTP_STATUS.BAD_REQUEST)

    // Delete the teacher account
    await TeacherModel.findByIdAndDelete(teacherId)

    return { message: 'Teacher account successfully deleted' }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createTeacherAccount,
  completeTeacherAccount,
  fetchTeacherAccounts,
  deleteTeacherAccount
}
