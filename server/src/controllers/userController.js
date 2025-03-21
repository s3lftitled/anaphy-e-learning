const {
  fetchUserDataService,
  updateProfileService,
  changePasswordService,
  recordQuizScoreService,
  fetchUserGradesService,
  sendMessageToStudentService,
} = require('../services/userService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class UserController {
  
  async fetchUserData(req, res, next) {
    const { userId } = req.params
    try {
      const user = await fetchUserDataService(userId)

      res.status(HTTP_STATUS.OK).json({ user, message: 'User fetched succesfully'})
    } catch (error) {
      logger.error(`Error fetching user data - ${error.message}`)
      next(error)
    }
  }

  async updateProfile(req, res, next) {
    const { userId } = req.params
    const { newName, base64Image } = req.body
    try {
      await updateProfileService(userId, base64Image, newName)
      res.status(HTTP_STATUS.OK).json({ message: 'Name changed succesfully' })
    } catch (error) {
      logger.error(`Error changing name - ${error.message}`)
      next(error)
    }
  }

  async changePassword(req, res, next) {
    const { userId } = req.params
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body
    try {
      await changePasswordService(userId, currentPassword, newPassword, newPasswordConfirmation)
      res.status(HTTP_STATUS.OK).json({ message: 'Password changed succesfully' })
    } catch (error) {
      logger.error(`Error changing password - ${error.message}`)
      next(error)
    }
  }

  async recordQuizScore(req, res, next) {
    const { userId } = req.params
    const { quizResults } = req.body
    try {
      await recordQuizScoreService(userId, quizResults)

      res.status(HTTP_STATUS.OK).json({ message: 'Score recorded succesfully' })
    } catch (error) {
      logger.error(`Error recording quiz score - ${error.message}`)
      next(error)
    }
  }

  async fetchUserGrades(req, res, next) {
    const { userEmail } = req.params
    try {
      const grades = await fetchUserGradesService(userEmail)

      res.status(HTTP_STATUS.OK).json({ grades })
    } catch (error) {
      logger.error(`Error fetching grades - ${error.message}`)
      next(error)
    }
  }

  async sendMessageToStudent (req, res, next) {
    const { teacherId, studentId } = req.params
    const { subject, message } = req.body
    try {
      await sendMessageToStudentService(teacherId, studentId, subject, message)

      res.status(HTTP_STATUS.OK).json({ message: 'Email sent succesfully' })
    } catch (error) {
      logger.error(`Error sending message - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new UserController()