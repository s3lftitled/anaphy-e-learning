const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const limiter = require('../middlewares/rateLimiter')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/registration', AuthController.register)
router.post('/v1/verify-email/:email', AuthController.verifyEmail)
router.post('/v1/login',  AuthController.logIn)
router.put('/v1/change-password/:userId', verifyToken, AuthController.changePassword)
router.delete('/v1/log-out', AuthController.logOut)
router.post('/v1/forgot-password', AuthController.forgotPassword)
router.put('/v1/reset-password/:resetToken', AuthController.resetPassword)
router.post('/v1/resend-verification/:email', AuthController.resendVerificationCode)

module.exports = router
