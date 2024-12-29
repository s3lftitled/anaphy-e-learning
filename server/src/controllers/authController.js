const { registerUser } = require('../services/authService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class AuthController {
  async register(req, res, next) {
    const { email, password, passwordConfirmation } = req.body
    try {
      await registerUser(email, password, passwordConfirmation)
      res.status(HTTP_STATUS.CREATED).json({ message: 'Registration successful! Please check your email for verification.'})
    } catch (error) {
      logger.error(`Registration error - ${error.message}`)
      next(error)
    }
  }
} 

module.exports = new AuthController()