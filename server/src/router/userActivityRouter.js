const express = require('express')
const router = express.Router()
const UserActivityController  = require('../controllers/userActivityController')

router.get('/v1/get-daily-active-users', UserActivityController.getDailyActiveUsers)
router.get('/v1/get-weekly-active-users', UserActivityController.getWeeklyActiveUsers)
router.get('/v1/get-monthly-active-users', UserActivityController.getMonthlyActiveUsers)
router.get('/v1/get-historical-user-activity', UserActivityController.getHistoricalUserActivity)

module.exports = router