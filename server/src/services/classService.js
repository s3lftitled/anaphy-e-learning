const ClassModel = require('../models/class.model')
const HTTP_STATUS = require('../constants/httpConstants')
const mongoose = require('mongoose')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const { generateUniqueClassCode } = require('../utils/classUtils')
const TeacherModel = require('../models/teacher.model')

const createClassService = async (userRole, teacherId, className) => {
  try {
    // Check if all required params are present
    validateRequiredParams(userRole, teacherId, className)

    // Check if user role is teacher to give permission
    appAssert(userRole === 'teacher', 'You dont have a permission to perform this action', HTTP_STATUS.FORBIDDEN)

    // Check if the provided teacherId is a valid MongoDB ObjectId
    appAssert(validator.isMongoId(teacherId), 'Invalid teacher ID format', HTTP_STATUS.BAD_REQUEST)

    // Find teacher accound by its id
    const teacher = await TeacherModel.findById(teacherId)

    // Check if teacher account exists
    appAssert(teacher, 'Teacher account not found', HTTP_STATUS.BAD_REQUEST)

    // Validate and sanitize name
    appAssert(className.length >= 6 && className.length <= 14, 'Name must be longer than 6 characters and shorter than 14', HTTP_STATUS.BAD_REQUEST)
    const sanitizedClassName = sanitizeHtml(className.trim())

    // Used a utility function to generate class code
    const classCode = await generateUniqueClassCode()

    const newClass = new ClassModel({
      name: sanitizedClassName,
      code: classCode,
      teacher: teacherId,
      students: [],
      grades: [],
    })

    await newClass.save()

    return classCode
  } catch (error) {
    throw(error)
  }
}

module.exports = {
  createClassService,
}