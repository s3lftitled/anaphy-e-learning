const {
  createTopicService,
  fetchAllTopicsService,
  fetchTopicService,
  fetchTopicLessonsService,
} = require('../services/topicService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class TopicController {
  async createTopic(req, res, next) {
    const { name, description } = req.body
    try {
      await createTopicService(name, description)
      res.status(HTTP_STATUS.CREATED).json({ message: 'Topic created succesfully' })
    } catch (error) {
      logger.error(`Topic creation error - ${error.message}`)
      next(error)
    }
  }

  async fetchAllTopics(req, res, next) {
    try {
      const allTopics = await fetchAllTopicsService()
      res.status(HTTP_STATUS.OK).json({ data: allTopics, message: 'Topics fetched succesfully'})
    } catch (error) {
      logger.error(`Topics fetching error - ${error.message}`)
      next(error)
    }
  }

  async fetchTopic(req, res, next) {
    const { topicId } = req.params
    try {
      const topic = await fetchTopicService(topicId)
      res.status(HTTP_STATUS.OK).json({ data: topic, message: 'Topic fetched succesfully'})
    } catch (error) {
      logger.error(`Topic fetching error - ${error.message}`)
      next(error)
    }
  }

  async fetchTopicLessons(req, res, next) {
    const { topicId } = req.params
    try {
      const topicLessons = await fetchTopicLessonsService(topicId)
      res.status(HTTP_STATUS.OK).json({ topicLessons, message: 'Topic lessons fetched succesfully' })
    } catch(error) {
      logger.error(`Error fetching topic lessons - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new TopicController()