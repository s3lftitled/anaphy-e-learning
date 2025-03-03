const {
  fetchUserDataService
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
}

module.exports = new UserController()