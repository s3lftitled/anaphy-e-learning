const express = require('express')
const router = express.Router()
const QuizController = require('../controllers/quizController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/create-quiz/:lessonId', verifyToken, QuizController.createQuiz)

module.exports = router