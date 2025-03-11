// controllers/progressController.js
const {
  saveUserProgressService,
  completeContentService,
  getUserProgressService,
  getUserTopicProgressService
} = require('../services/progressService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class ProgressController {
  async saveUserProgress(req, res, next) {
    const { userId, topicId, lessonId, contentId } = req.body
    try {
      await saveUserProgressService(userId, topicId, lessonId, contentId)
      
      res.status(HTTP_STATUS.OK).json({ 
        message: 'Progress saved successfully' 
      })
    } catch (error) {
      logger.error(`Error saving user progress - ${error.message}`);
      next(error)
    }
  }

  async completeContent(req, res, next) {
    const { userId, topicId, lessonId, contentId, contentType = 'page' } = req.body
    try {
      await completeContentService(userId, topicId, lessonId, contentId, contentType)
      
      res.status(HTTP_STATUS.OK).json({ 
        message: 'Content marked as completed' 
      })
    } catch (error) {
      logger.error(`Error marking content as completed - ${error.message}`)
      next(error)
    }
  }

  async getUserProgress(req, res, next) {
    const { userId } = req.params
    try {
      const progress = await getUserProgressService(userId)
      
      res.status(HTTP_STATUS.OK).json({ 
        progress, 
        message: 'User progress fetched successfully' 
      })
    } catch (error) {
      logger.error(`Error fetching user progress - ${error.message}`)
      next(error)
    }
  }

  async getUserTopicProgress(req, res, next) {
    const { userId, topicId } = req.params
    try {
      const progress = await getUserTopicProgressService(userId, topicId)
      
      res.status(HTTP_STATUS.OK).json({ 
        progress, 
        message: 'User topic progress fetched successfully' 
      })
    } catch (error) {
      logger.error(`Error fetching user topic progress - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new ProgressController()