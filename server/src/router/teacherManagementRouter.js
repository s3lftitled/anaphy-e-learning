const express = require('express')
const router = express.Router()
const TeacherManagementController = require('../controllers/teacherManagementController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/create-teacher', verifyToken, TeacherManagementController.createTeacher)
router.put('/v1/complete-teacher/:id/:token', verifyToken, TeacherManagementController.completeTeacher)
router.get('/v1/fetch-teachers', verifyToken, TeacherManagementController.fetchTeacher)
router.delete('/v1/delete-teacher/:teacherId', verifyToken, TeacherManagementController.deleteTeacher)

module.exports = router