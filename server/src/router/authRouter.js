const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')

router.post('/v1/registration', AuthController.register)
router.post('/v1/verify-email/:email', AuthController.verifyEmail)
router.post('/v1/login', AuthController.logIn)
router.put('/v1/change-password/:userId', AuthController.changePassword)

module.exports = router