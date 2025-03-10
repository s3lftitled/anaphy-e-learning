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

const changeUserNameService = async (userId, newName) => {
  try {
    validateRequiredParams( userId, newName )

    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    const sanitizedName = sanitizeHtml(newName.trim())

    appAssert(
      sanitizedName.length <= 35 && sanitizedName.length >= 6,
      'Name should be a minimum of 6 characters and a maximum of 35 characters',
      HTTP_STATUS.BAD_REQUEST
    )
    
    let user = await UserModel.findById(userId)

    if (!user) {
      user = await TeacherModel.findById(userId)
    }

    appAssert(user, 'User is not found', HTTP_STATUS.NOT_FOUND)

    user.name = sanitizedName
    await user.save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  fetchUserDataService, 
  changeUserNameService,
}