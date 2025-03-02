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
  
      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.SECRET_KEY,
        { expiresIn: '20m' }
      )
  
      return newAccessToken
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
  }
}


module.exports = {
  refreshAccessToken,
}