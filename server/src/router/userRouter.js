const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.get('/v1/fetch-user/:userId', verifyToken, UserController.fetchUserData)
router.put('/v1/update-profile/:userId', verifyToken, UserController.updateProfile)
router.put('/v1/change-password/:userId', verifyToken, UserController.changePassword)
router.post('/v1/record-quiz-score/:userId', verifyToken, UserController.recordQuizScore)
router.get('/v1/fetch-student-grades/:userEmail', UserController.fetchUserGrades)
router.post('/v1/send-message-to-student/:teacherId/:studentId', UserController.sendMessageToStudent)

module.exports = router