const express = require('express')
const router = express.Router()
const TopicController = require('../controllers/topicController')

router.post('/v1/create-topic', TopicController.createTopic)
router.get('/v1/fetch-all-topics', TopicController.fetchAllTopics)
router.get('/v1/fetch-topic/:topicId', TopicController.fetchTopic)

module.exports = router