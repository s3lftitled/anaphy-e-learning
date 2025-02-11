const { 
 createLessonService,
 fetchLessonPages,
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

  // Controller for fetching paginated lesson pages
  async fetchLessonPages(req, res, next) {
    const { lessonId } = req.params
    const { page, limit } = req.query // Get page and limit from query parameters

    try {
      // Fetch paginated pages for the lesson
      const result = await fetchLessonPages(lessonId, page, limit)

      // Return paginated data
      res.status(HTTP_STATUS.OK).json({
        pages: result.pages,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      })
    } catch (error) {
      logger.error(`Fetch lesson pages error - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new LessonController()