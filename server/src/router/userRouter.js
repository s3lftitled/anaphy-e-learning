const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/v1/fetch-user/:userId', UserController.fetchUserData)
router.put('/v1/change-user-name/:userId', UserController.changeUserName)
router.put('/v1/change-password/:userId', UserController.changePassword)

module.exports = router