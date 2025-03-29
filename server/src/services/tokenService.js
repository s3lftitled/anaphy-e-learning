const UserModel = require('../models/user.model')
const TeacherModel = require('../models/teacher.model')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')
const jwt = require('jsonwebtoken')
const logger = require('../logger/logger')
require('dotenv').config()

const refreshAccessToken = async (refreshToken) => {
    try {
      console.log('refresh token request received')

      console.log(refreshToken)
      // Check if refresh token is missing
      if (!refreshToken) {
        logger.error("Missing refresh token")
        throw new Error("Missing refresh token")
      }
  
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY)
      const userId = decoded.id

      let user = await UserModel.findById(userId)

      if (!user) {
        user = await TeacherModel.findById(userId)
      }
      
      appAssert(user, 'User not found', HTTP_STATUS.NOT_FOUND)

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.SECRET_KEY,
        { expiresIn: '20m' }
      )
  
      return { newAccessToken, userId }
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
  }
}


module.exports = {
  refreshAccessToken,
}