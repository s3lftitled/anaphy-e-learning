const {
  createQuizService,
} = require('../services/quizService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class QuizController {
  async createQuiz(req, res, next) {
    const { lessonId } = req.params
    const { 
      title, 
      description, 
      timeLimit, 
      passingScore, 
      questions,
    } = req.body
    try {
      await createQuizService( title, 
        description, 
        timeLimit, 
        passingScore, 
        questions,
        lessonId,
      )

      res.status(HTTP_STATUS.CREATED).json({ message: 'Quiz created succesfully' })
    } catch (error) {
      logger.error(`Error creating a quiz - ${error.message}`)
      next(error)
    }
  }
} 

module.exports = new QuizController()