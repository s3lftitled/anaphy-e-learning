const {
  createTeacherAccount,
  completeTeacherAccount
} = require('../services/teacherManagementService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class TeacherManagementController {
  async createTeacher(req, res, next) {
    const { email } = req.body
    try {
      await createTeacherAccount(email)
      res.status(HTTP_STATUS.OK).json({ message: 'Teacher account succesfully created, confirmation link has beent sent to their email'})
    } catch (error) {
      logger.error(`Teacher creation error - ${error.message}`)
      next(error)
    }
  }

  async completeTeacher(req, res, next) {
    const { id, token } = req.params
    const { name, password } = req.body
    try {
      await completeTeacherAccount(id, token, name, password)
      res.status(HTTP_STATUS.OK).json({ message: 'Account succesfully activated'})
    } catch (error) {
      logger.error(`Teacher creation error - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new TeacherManagementController()