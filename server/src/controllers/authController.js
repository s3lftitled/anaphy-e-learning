const { 
  registerUser, 
  verifyEmail, 
  logIn, 
  changePassword,
  logOutService, 
  forgotPasswordService,
  resetPasswordService,
  resendVerificationCodeService,
} = require('../services/authService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class AuthController {
  async register(req, res, next) {
    const { name, email, password, passwordConfirmation, recaptcha } = req.body
    try {
      await registerUser(name, email, password, passwordConfirmation, recaptcha)
      res.status(HTTP_STATUS.CREATED).json({
        message: "Registration successful! Check email for verification code. Account will be deleted if not verified within 30 mins."
      })
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
        sameSite: 'lax',
      })

      res.status(HTTP_STATUS.OK).json({ user, accessToken, message: 'Log in succesfully' })
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

  async logOut(_, res, next) {
    try {
      await logOutService(res)

      res.status(HTTP_STATUS.OK).json({ message: 'Logged out succesfully' })
    } catch (error) {
      logger.error(`Error logging out - ${error.message}`)
      next(error)
    }
  }

  async forgotPassword(req, res, next) {
    const { email } = req.body
    try {
      await forgotPasswordService(email)

      res.status(HTTP_STATUS.OK).json({ message: 'Password reset instruction has been sent to the email'})
    } catch (error) {
      logger.error(`Error forgotting password - ${error.message}`)
      next(error)
    }
  }

  async resetPassword(req, res, next) {
    const { resetToken } = req.params
    const { newPassword, newPasswordConfirmation } = req.body
    try {
      await resetPasswordService(resetToken, newPassword, newPasswordConfirmation)

      res.status(HTTP_STATUS.OK).json({ message: 'Password reset succesfully' })
    } catch (error) {
      logger.error(`Error resetting password - ${error.message}`)
      next(error)
    }
  }

  async resendVerificationCode(req, res, next) {
    const { email } = req.params
    try {
      await resendVerificationCodeService(email)
      res.status(HTTP_STATUS.OK).json({ 
        message: 'A new verification code has been sent to your email' 
      })
    } catch (error) {
      logger.error(`Resend verification error - ${error.message}`)
      next(error)
    }
  }
} 

module.exports = new AuthController()