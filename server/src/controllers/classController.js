const {
  createClassService,
} = require('../services/classService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class ClassController {
  async createClass(req, res, next) {
    const { userRole, teacherId } = req.params
    const { className } = req.body
    try {
      const code = await createClassService(userRole, teacherId, className)

      res.status(HTTP_STATUS.CREATED).json({ code, message: 'Class created succesfully' })
    } catch (error) {
      logger.error(`Class creation error - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new ClassController()
