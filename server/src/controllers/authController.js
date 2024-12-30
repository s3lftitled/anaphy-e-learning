const { registerUser, verifyEmail, logIn } = require('../services/authService')
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

  async verifyEmail(req, res, next) {
    const { email } = req.params
    const { verificationCode } = req.body
    try {
      await verifyEmail(email, verificationCode)
      res.status(HTTP_STATUS.OK).json({ message: 'Email verified succesfully' })
    } catch (error) {
      logger.error(`Verification error - ${error.message}`)
      next(error)
    }
  }

  async logIn(req, res, next) {
    const { email, password } = req.body
    try {
      const user = await logIn(email, password)
      res.status(HTTP_STATUS.OK).json({ data: user, message: 'Log in succesfully' })
    } catch (error) {
      logger.error(`Login error - ${error.message}`)
      next(error)
    }
  }
} 

module.exports = new AuthController()