const express = require('express')
const router = express.Router()
const LessonController = require('../controllers/lessonController')

router.post('/v1/create-lesson/:topicId', LessonController.createLesson)

module.exports = router