const express = require('express')
const router = express.Router()
const ClassController = require('../controllers/classController')

router.post('/v1/create-class/:userRole/:teacherId', ClassController.createClass)
router.post('/v1/invite-student/:userRole/:teacherId/:studentId/:classId', ClassController.inviteStudent)
router.put('/v1/accept-invite/:userRole/:studentId/:classId', ClassController.acceptInvite)
router.delete('/v1/reject-invite/:userRole/:studentId/:classId', ClassController.rejectInvite)
router.get('/v1/fetch-teacher-classes/:teacherId', ClassController.fetchTeacherClasses)

module.exports = router