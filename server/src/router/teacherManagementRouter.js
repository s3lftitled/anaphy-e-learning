const express = require('express')
const router = express.Router()
const TeacherManagementController = require('../controllers/teacherManagementController')
const { verifyToken } = require('../middlewares/jsonWebTokens')
const { checkRole, ROLES } = require('../middlewares/accessControl')

router.post('/v1/create-teacher', verifyToken, checkRole([ROLES.LEVEL_3]), TeacherManagementController.createTeacher)
router.put('/v1/complete-teacher/:id/:token', TeacherManagementController.completeTeacher)
router.get('/v1/fetch-teachers', verifyToken, checkRole([ROLES.LEVEL_3]), TeacherManagementController.fetchTeacher)
router.delete('/v1/delete-teacher/:teacherId', verifyToken, checkRole([ROLES.LEVEL_3]), TeacherManagementController.deleteTeacher)
router.get('/v1/teacher-classes/:teacherId', verifyToken, checkRole([ROLES.LEVEL_3]), TeacherManagementController.fetchTeacherClasses)

module.exports = router