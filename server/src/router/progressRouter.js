// routes/progressRouter.js
const express = require('express')
const router = express.Router()
const ProgressController = require('../controllers/progressController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/save-progress', verifyToken, ProgressController.saveUserProgress)
router.post('/v1/complete-content', verifyToken, ProgressController.completeContent)
router.get('/v1/get-progress/:userId', verifyToken, ProgressController.getUserProgress)
router.get('/v1/get-progress/:userId/:topicId', verifyToken, ProgressController.getUserTopicProgress)
router.post('/v1/update-progress/:userId', verifyToken, ProgressController.updateProgress)

module.exports = router