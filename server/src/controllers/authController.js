const { 
  registerUser, 
  verifyEmail, 
  logIn, 
  changePassword 
} = require('../services/authService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class AuthController {
  async register(req, res, next) {
    const { name, email, password, passwordConfirmation, recaptcha } = req.body
    try {
      await registerUser(name, email, password, passwordConfirmation, recaptcha)
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
      const { user, accessToken, refreshToken} = await logIn(email, password)

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })

      res.status(HTTP_STATUS.OK).json({ data: { user, accessToken } , message: 'Log in succesfully' })
    } catch (error) {
      logger.error(`Login error - ${error.message}`)
      next(error)
    }
  }

  async changePassword(req, res, next) {
    const { userId } = req.params
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body
    try {
      await changePassword(userId, currentPassword, newPassword, newPasswordConfirmation)
      res.status(HTTP_STATUS.OK).json({ message: 'Password changed succesfully' })
    } catch (error) {
      logger.error(`Login error - ${error.message}`)
      next(error)
    }
  } 
} 

module.exports = new AuthController()