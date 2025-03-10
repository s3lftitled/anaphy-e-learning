const {
  fetchUserDataService,
  changeUserNameService,
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

  async changeUserName(req, res, next) {
    const { userId } = req.params
    const { newName } = req.body
    try {
      await changeUserNameService(userId, newName)
      res.status(HTTP_STATUS.OK).json({ message: 'Name changed succesfully' })
    } catch (error) {
      logger.error(`Error changing name - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new UserController()