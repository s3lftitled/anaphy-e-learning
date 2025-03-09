const { 
  saveIssueService, 
} = require('../services/issueService')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class IssueController {
  async submitIssue(req, res, next) {
    const { type, title, description, email } = req.body
    try {
      const savedIssue = await saveIssueService(type, title, description, email)
      res.status(HTTP_STATUS.CREATED).json({ savedIssue, message: 'Ticket submitted succesfully' })
    } catch (error) {
      logger.error(`Error submitting the issue - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new IssueController()