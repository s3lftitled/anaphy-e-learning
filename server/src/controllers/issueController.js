const { 
  saveIssueService, 
  fetchIssuesService,
  resolveIssueService,
  contactUserService,
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

  async fetchIssues(req, res, next) {
    try {
      const issues = await fetchIssuesService()

      res.status(HTTP_STATUS.OK).json({ issues })
    } catch (error) {
      logger.error(`Error fetching issues - ${error.message}`)
      next(error)
    }
  }

  async resolveIssue(req, res, next) {
    const { issueId } = req.params
    try {
      await resolveIssueService(issueId)

      res.status(HTTP_STATUS.OK).json({ message: 'Issue resolved succesfully' })
    } catch (error) {
      logger.error(`Error resolving issue - ${error.message}`)
      next(error)
    }
  }

  async contactUser(req, res, next) {
    const { issueId } = req.params
    const { subject, message } = req.body
    try {
      await contactUserService(subject, message, issueId)

      res.status(HTTP_STATUS.OK).json({ message: 'Contacted issue sender succesfully' })
    } catch (error) {
      logger.error(`Error contacting user - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new IssueController()
