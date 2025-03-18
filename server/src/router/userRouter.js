const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.get('/v1/fetch-user/:userId', verifyToken, UserController.fetchUserData)
router.put('/v1/update-profile/:userId', verifyToken, UserController.updateProfile)
router.put('/v1/change-password/:userId', verifyToken, UserController.changePassword)

module.exports = router