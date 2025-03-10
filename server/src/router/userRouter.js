const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/v1/fetch-user/:userId', UserController.fetchUserData)
router.put('/v1/change-user-name/:userId', UserController.changeUserName)

module.exports = router