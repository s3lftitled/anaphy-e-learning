const express = require('express')
const router = express.Router()
const TeacherManagementController = require('../controllers/teacherManagementController')

router.post('/v1/create-teacher', TeacherManagementController.createTeacher)
router.put('/v1/complete-teacher/:id/:token', TeacherManagementController.completeTeacher)

module.exports = router