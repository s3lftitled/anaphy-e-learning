const express = require('express')
const router = express.Router()
const LessonController = require('../controllers/lessonController')

router.post('/v1/create-lesson/:topicId', LessonController.createLesson)
router.get('/v1/fetch-lesson-contents/:lessonId', LessonController.fetchLessonPages)

module.exports = router