// routes/progressRouter.js
const express = require('express')
const router = express.Router()
const ProgressController = require('../controllers/progressController')

router.post('/v1/save-progress', ProgressController.saveUserProgress)
router.post('/v1/complete-content', ProgressController.completeContent)
router.get('/v1/get-progress/:userId', ProgressController.getUserProgress)
router.get('/v1/get-progress/:userId/:topicId', ProgressController.getUserTopicProgress)
router.post('/v1/update-progress/:userId', ProgressController.updateProgress)

module.exports = router