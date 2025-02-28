const {
  createTeacherAccount,
  completeTeacherAccount,
  fetchTeacherAccounts,
  deleteTeacherAccount,
} = require('../services/teacherManagementService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class TeacherManagementController {
  async createTeacher(req, res, next) {
    const { email } = req.body
    try {
      const teacher = await createTeacherAccount(email)
      res.status(HTTP_STATUS.CREATED).json({ message: 'Teacher account succesfully created, confirmation link has beent sent to their email', teacher})
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

  async fetchTeacher(req, res, next) {
    try {
      const teachers = await fetchTeacherAccounts()
      res.status(HTTP_STATUS.OK).json({ message: 'Teachers fetched succesfully', teachers})
    } catch(error) {
      logger.error(`Error fetching teachers - ${error.message}`)
      next(error)
    }
  }

  async deleteTeacher(req, res, next) {
    const { teacherId } = req.params
    try {
      const response = await deleteTeacherAccount(teacherId)

      res.status(HTTP_STATUS.OK).json({ message: response })
    } catch (error) {
      logger.error(`Error deleting teacher - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new TeacherManagementController()