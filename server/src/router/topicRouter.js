const express = require('express')
const router = express.Router()
const TopicController = require('../controllers/topicController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/create-topic', verifyToken, TopicController.createTopic)
router.get('/v1/fetch-all-topics', verifyToken, TopicController.fetchAllTopics)
router.get('/v1/fetch-topic/:topicId', verifyToken, TopicController.fetchTopic)
router.get('/v1/fetch-topic-lessons/:topicId', verifyToken, TopicController.fetchTopicLessons)
router.get('/v1/fetch-topic-contents', verifyToken, TopicController.fetchTopicContents)

module.exports = router