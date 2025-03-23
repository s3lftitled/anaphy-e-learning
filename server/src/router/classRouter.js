const express = require('express')
const router = express.Router()
const ClassController = require('../controllers/classController')
const classController = require('../controllers/classController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/create-class/:userRole/:teacherId', verifyToken, ClassController.createClass)
router.get('/v1/fetch-class-invites/:studentId', ClassController.fetchClassInvites)
router.post('/v1/invite-student/:teacherId/:classId', verifyToken, ClassController.inviteStudent)
router.put('/v1/accept-invite/:studentId/:classId', verifyToken, ClassController.acceptInvite)
router.delete('/v1/reject-invite/:studentId/:classId', verifyToken, ClassController.rejectInvite)
router.get('/v1/fetch-teacher-classes/:teacherId', verifyToken, ClassController.fetchTeacherClasses)
router.post('/v1/join-class/:studentId', verifyToken, ClassController.joinClass)
router.get('/v1/search-class', verifyToken, ClassController.searchClass)
router.get('/v1/fetch-pending-approvals/:classId', verifyToken, ClassController.fetchPendingApprovals)
router.put('/v1/accept-pending-approval/:classId/:studentId', verifyToken, ClassController.acceptPendingApprovals)
router.delete('/v1/reject-pending-approval/:classId/:studentId', verifyToken, ClassController.rejectPendingApprovalRequest)
router.post('/v1/create-class-announcement/:teacherId/:classId', verifyToken, ClassController.createClassAnnouncement)
router.get('/v1/fetch-announcements/:classId', verifyToken, ClassController.fetchClassAnnouncements)
router.get('/v1/fetch-joined-classes/:studentId', verifyToken, ClassController.fetchStudentJoinedClasses)
router.delete('/v1/remove-student/:classId/:studentId', ClassController.removeStudent)

module.exports = router