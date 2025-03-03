const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/v1/fetch-user/:userId', UserController.fetchUserData)

module.exports = router