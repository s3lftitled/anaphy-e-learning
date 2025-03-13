const express = require('express')
const router = express.Router()
const QuizController = require('../controllers/quizController')

router.post('/v1/create-quiz/:lessonId', QuizController.createQuiz)

module.exports = router