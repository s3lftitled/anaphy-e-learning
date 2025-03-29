const express = require('express')
const router = express.Router()
const LessonController = require('../controllers/lessonController')
const { verifyToken } = require('../middlewares/jsonWebTokens')
const { checkRole, ROLES } = require('../middlewares/accessControl')

router.post('/v1/create-lesson/:topicId', verifyToken, checkRole([ROLES.LEVEL_3]), LessonController.createLesson)
router.get('/v1/fetch-lesson-contents/:lessonId', verifyToken, LessonController.fetchLessonPages)

module.exports = router