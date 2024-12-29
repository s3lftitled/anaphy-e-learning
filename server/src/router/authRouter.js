const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')

router.post('/v1/registration', AuthController.register)

module.exports = router