const { 
 createLessonService,
} = require('../services/lessonService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class LessonController {
  async createLesson(req, res, next) {
    const { title, description, order } = req.body
    const  { topicId } = req.params
    try {
      await createLessonService(title, topicId, description, order)
      res.status(HTTP_STATUS.CREATED).json({ message: 'Lesson created succesfully' })
    } catch (error) {
      logger.error(`Lesson creation error - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new LessonController()