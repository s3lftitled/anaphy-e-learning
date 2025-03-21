const TeacherModel = require('../models/teacher.model')
const UserModel = require("../models/user.model")
const PasswordUtil = require('../utils/passwordUtils')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')
const sharp = require('sharp')
const EmailUtil = require('../utils/emailUtils')

const fetchUserDataService = async (userId) => {
  try {
    validateRequiredParams(userId)

    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    // Check in UserModel first
    const user = await UserModel.findById(userId).lean()
    if (user) {
      return {
        id: user._id,
        profilePicture: user.profilePicture,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedClasses: user.joinedClasses || []
      }
    }

    // Check in TeacherModel if not found in UserModel
    const teacher = await TeacherModel.findById(userId).lean()
    appAssert(teacher, 'No user is associated with that ID', HTTP_STATUS.BAD_REQUEST)

    appAssert(teacher.status === 'active', 'Your account is not activated', HTTP_STATUS.BAD_REQUEST)

    return {
      id: teacher._id,
      profilePicture: teacher.profilePicture,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      classes: teacher.classes,
    }

  } catch (error) {
    throw error
  }
}

const updateProfileService = async (userId, base64Image, newName) => {
  try {
    appAssert(base64Image || newName, 'No new data to change', HTTP_STATUS.BAD_REQUEST)

    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    let user = await UserModel.findById(userId)

    if (!user) {
      user = await TeacherModel.findById(userId)
    }

    appAssert(user, 'User is not found', HTTP_STATUS.NOT_FOUND)

    if (base64Image) {
      const allowedFormats = ['jpeg', 'jpg', 'png']
      // Detect the image format from base64 string
      const detectedFormat = base64Image.match(/^data:image\/(\w+);base64,/)
      const imageFormat = detectedFormat ? detectedFormat[1] : null
 
       // Check if image format is supported
      appAssert(
        imageFormat || allowedFormats.includes(imageFormat.toLowerCase()), 
        'Unsupported image format. Please upload a JPEG, JPG, or PNG image.',
        HTTP_STATUS.BAD_REQUEST
      ) 
  
        // Convert base64 image to buffer
      const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64')
  
      // Resize the image
      const resizedImage = await sharp(imageBuffer)
        .resize({
          fit: 'cover',
          width: 200,
          height: 200,
          withoutEnlargement: true,
        })
        .toFormat(imageFormat)
        .toBuffer()
  
      // Convert resized image buffer to base64
      const resizedImageBase64 = `data:image/${imageFormat};base64,${resizedImage.toString('base64')}`

      user.profilePicture = resizedImageBase64
      await user.save()
    }

    if (newName) {
      const sanitizedName = sanitizeHtml(newName.trim())

      appAssert(
        sanitizedName.length <= 35 && sanitizedName.length >= 6,
        'Name should be a minimum of 6 characters and a maximum of 35 characters',
        HTTP_STATUS.BAD_REQUEST
      )
      user.name = sanitizedName
      await user.save()
    }

  } catch (error) {
    throw error
  }
}

const changePasswordService = async (userId, currentPassword, newPassword, newPasswordConfirmation) => {
  try {
    validateRequiredParams(userId, currentPassword, newPassword, newPasswordConfirmation)

    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    let user = await UserModel.findById(userId)

    if (!user) {
      user = await TeacherModel.findById(userId)
    }

    appAssert(user, 'User not found', HTTP_STATUS.NOT_FOUND)

    const isPasswordMatch = await PasswordUtil.comparePassword(currentPassword, user.password)

    appAssert(isPasswordMatch, 'Incorrect password', HTTP_STATUS.BAD_REQUEST)

    appAssert(
      newPassword === newPasswordConfirmation, 
      'New password and password confirmation do not match', 
      HTTP_STATUS.BAD_REQUEST
    )

    const hashedPassword = await PasswordUtil.hashPassword(newPassword)

    user.password = hashedPassword
    await user.save()
  } catch (error) {
    throw error
  }
}


const recordQuizScoreService = async (userId, quizResults) => {
  try {
    console.log(quizResults)
    validateRequiredParams(userId, quizResults)
    
    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    const user = await UserModel.findById(userId)

    appAssert(user, 'User is not found', HTTP_STATUS.NOT_FOUND)
    appAssert(quizResults, 'Quiz results is not found', HTTP_STATUS.NOT_FOUND)

    // Process array of quiz results or single quiz result
    const quizResultsArray = Array.isArray(quizResults) ? quizResults : [quizResults]
    
    // Get existing quiz IDs from user's grades
    const existingQuizIds = user.grades.map(grade => grade.quiz.toString())
    
    // Filter out quizzes that have already been recorded
    const newQuizResults = quizResultsArray.filter(result => 
      !existingQuizIds.includes(result.quiz.toString())
    )
    
    // Add only new quiz results to user's grades
    for (const quizResult of newQuizResults) {
      const gradeEntry = {
        quiz: quizResult.quiz,
        score: quizResult.score,
        totalPoints: quizResult.totalPoints,
        percentage: quizResult.percentage,
        passed: quizResult.passed,
        completedAt: quizResult.completedAt || new Date()
      }
      
      user.grades.push(gradeEntry)
    }

    if (newQuizResults.length > 0) {
      await user.save()
    }
    
    return user
  } catch (error) {
    throw error
  }
}

const fetchUserGradesService = async (userEmail) => {
  try {
    validateRequiredParams(userEmail)
    
    appAssert(validator.isEmail(userEmail), 'Invalid email format', HTTP_STATUS.BAD_REQUEST)
    
    const user = await UserModel.findOne({ email: userEmail })
      .populate({
        path: 'grades.quiz',
        select: 'title' // This will populate the quiz titles
      })
    
    appAssert(user, 'User is not found', HTTP_STATUS.NOT_FOUND)
    
    return user.grades
    
  } catch (error) {
    throw error
  }
}

const sendMessageToStudentService = async (teacherId, studentId, subject, message) => {
  try {
    validateRequiredParams(teacherId, studentId, subject, message)

    appAssert(validator.isMongoId(teacherId), 'Invalid class id format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(studentId), 'Invalid user id format', HTTP_STATUS.BAD_REQUEST)

    const teacher = await TeacherModel.findById(teacherId)
    appAssert(teacher, 'Teacher is not found', HTTP_STATUS.NOT_FOUND)

    const student = await UserModel.findById(studentId)
    appAssert(student, 'Student is not found', HTTP_STATUS.NOT_FOUND)
 
    await EmailUtil.sendMessageToStudent(teacher.email, student.email, subject, message)
  } catch (error) {
    throw error
  }
}

module.exports = {
  fetchUserDataService, 
  updateProfileService,
  changePasswordService,
  recordQuizScoreService,
  fetchUserGradesService,
  sendMessageToStudentService,
}