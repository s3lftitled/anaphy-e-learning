const express = require('express')
const router = express.Router()
const UserActivityController  = require('../controllers/userActivityController')
const { verifyToken } = require('../middlewares/jsonWebTokens')
const { checkRole, ROLES } = require('../middlewares/accessControl')

router.get('/v1/get-daily-active-users', verifyToken, checkRole([ROLES.LEVEL_3]), UserActivityController.getDailyActiveUsers)
router.get('/v1/get-weekly-active-users', verifyToken, checkRole([ROLES.LEVEL_3]),  UserActivityController.getWeeklyActiveUsers)
router.get('/v1/get-monthly-active-users', verifyToken, checkRole([ROLES.LEVEL_3]), UserActivityController.getMonthlyActiveUsers)
router.get('/v1/get-historical-user-activity', verifyToken, checkRole([ROLES.LEVEL_3]), UserActivityController.getHistoricalUserActivity)

module.exports = router