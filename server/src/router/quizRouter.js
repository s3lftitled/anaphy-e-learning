const express = require('express')
const router = express.Router()
const QuizController = require('../controllers/quizController')
const { verifyToken } = require('../middlewares/jsonWebTokens')
const { checkRole, ROLES } = require('../middlewares/accessControl')

router.post('/v1/create-quiz/:lessonId', verifyToken, checkRole([ROLES.LEVEL_3]),QuizController.createQuiz)

module.exports = router