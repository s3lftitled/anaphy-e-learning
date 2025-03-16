const {
  getDailyActiveUsersService,
  getWeeklyActiveUsersService,
  getMonthlyActiveUsersService,
  getHistoricalUserActivityService,
} = require('../services/userActivityService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class UserActivityController {
  async getDailyActiveUsers(req, res, next) {
    try {
      const dailyActiveUsers = await getDailyActiveUsersService()

      res.status(HTTP_STATUS.OK).json({ dailyActiveUsers })
    } catch (error) {
      logger.error(`Error getting daily active users - ${error.message}`)
      next(error)
    }
  }

  async getWeeklyActiveUsers(req, res, next) {
    try {
      const weeklyActiveUsers = await getWeeklyActiveUsersService()

      res.status(HTTP_STATUS.OK).json({ weeklyActiveUsers })
    } catch (error) {
      logger.error(`Error getting weekly active users - ${error.message}`)
      next(error)
    }
  }

  async getMonthlyActiveUsers(req, res, next) {
    try {
      const monthlyActiveUsers = await getMonthlyActiveUsersService()

      res.status(HTTP_STATUS.OK).json({ monthlyActiveUsers })
    } catch (error) {
      logger.error(`Error getting monthly active users - ${error.message}`)
      next(error)
    }
  }

  async getHistoricalUserActivity(req, res, next) {
    try {
      // Get the number of days from query parameters, default to 7 days
      const days = parseInt(req.query.days) || 7
      
      // Limit to a reasonable range (1-30 days)
      const limitedDays = Math.min(Math.max(days, 1), 30)
      
      const history = await getHistoricalUserActivityService(limitedDays)
      
      res.status(HTTP_STATUS.OK).json({ history })
    } catch (error) {
      logger.error(`Error getting historical user activity - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new UserActivityController()