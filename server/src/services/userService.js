const TeacherModel = require('../models/teacher.model')
const UserModel = require("../models/user.model")
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')

const fetchUserDataService = async (userId) => {
  try {
    validateRequiredParams(userId)

    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    // Check in UserModel first
    const user = await UserModel.findById(userId).lean()
    if (user) {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }

    // Check in TeacherModel if not found in UserModel
    const teacher = await TeacherModel.findById(userId).lean()
    appAssert(teacher, 'No user is associated with that ID', HTTP_STATUS.BAD_REQUEST)

    appAssert(teacher.status === 'active', 'Your account is not activated', HTTP_STATUS.BAD_REQUEST)

    return {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      classes: teacher.classes,
    }

  } catch (error) {
    throw error
  }
}

module.exports = {
  fetchUserDataService
}