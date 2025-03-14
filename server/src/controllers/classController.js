const {
  createClassService,
  acceptInvitationService,
  rejectInvitationService,
  inviteStudentService,
  fetchTeacherClassService,
  joinClassService,
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

  async inviteStudent(req, res, next) {
    const { userRole, teacherId, studentId, classId } = req.params
    try {
      await inviteStudentService(userRole, teacherId, studentId, classId)

      res.status(HTTP_STATUS.CREATED).json({ message: 'Student invited succesfully' })
    } catch (error) {
      logger.error(`Student invitation error - ${error.message}`)
      next(error)
    }
  }

  async acceptInvite(req, res, next) {
    const { userRole, studentId, classId} = req.params
    try {
      await acceptInvitationService(userRole, studentId, classId)

      res.status(HTTP_STATUS.OK).json({ message: 'Class joined succesfully' })
    } catch (error) {
      logger.error(`Error accepting class invitation - ${error.message}`)
      next(error)
    }
  }

  async rejectInvite(req, res, next) {
    const { userRole, studentId, classId} = req.params
    try {
      await rejectInvitationService(userRole, studentId, classId)

      res.status(HTTP_STATUS.OK).json({ message: 'Invitation rejected succesfully' })
    } catch (error) {
      logger.error(`Error rejecting class invitation - ${error.message}`)
      next(error)
    }
  }

  async fetchTeacherClasses(req, res, next) {
    const { teacherId } = req.params
    try {
      const classesDetails = await fetchTeacherClassService(teacherId)

      res.status(HTTP_STATUS.OK).json({ classesDetails, message: 'Fetch classes and its details succesfully' })
    } catch (error) {
      logger.error(`Error fetching teacher classes - ${error.message}`)
      next(error)
    }
  }

  async joinClass(req, res, next) {
    const { studentId } = req.params
    const { classCode } = req.body
    try {
      await joinClassService(classCode, studentId)

      res.status(HTTP_STATUS.OK).json({ message: 'Request sent! Waiting for teacher approval.' })
    } catch (error) {
      logger.error(`Error joining class - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new ClassController()
