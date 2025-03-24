const IssueModel = require('../models/issue.model')
const HTTP_STATUS = require('../constants/httpConstants')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const EmailUtil = require('../utils/emailUtils')

const VALID_TYPES = ['Question', 'Feature Request', 'Bug Report', 'Other']

const saveIssueService = async (type, title, description, email) => {
  try {
    // Validate all required parameters are present
    validateRequiredParams({ type, title, description, email })

    // Validate email format
    appAssert(validator.isEmail(email), 'Invalid email', HTTP_STATUS.BAD_REQUEST)

    // Sanitize inputs to prevent XSS attacks
    const sanitizedType = sanitizeHtml(type.trim())
    const sanitizedTitle = sanitizeHtml(title.trim())
    const sanitizedDescription = sanitizeHtml(description.trim())
    
    // Validate title length after sanitization
    appAssert(sanitizedTitle.length <= 50, 'Title should be 30 characters max', HTTP_STATUS.BAD_REQUEST)
    
    // Validate issue type is one of the allowed types
    appAssert(VALID_TYPES.includes(sanitizedType), 'Invalid issue type', HTTP_STATUS.BAD_REQUEST)

    // Create the issue object with sanitized inputs
    const newIssue = {
      issueType: sanitizedType,
      title: sanitizedTitle,
      description: sanitizedDescription,
      email: email // Email doesn't need sanitization since we validated its format
    }

    // Save to database and return the created issue
    const savedIssue = await IssueModel.create(newIssue)
    
    // Return the saved issue with its generated _id
    return savedIssue
  } catch(error) {
    throw error
  }
}

const fetchIssuesService = async () => {
  try {
     const issues = await IssueModel.find({})
     return  issues
  } catch (error) {
    throw error
  }
}

const resolveIssueService = async (issueId) => {
  try {
    // Find the issue by ID
    const issue = await IssueModel.findById(issueId)
    appAssert(issue, 'Issue not found', HTTP_STATUS.NOT_FOUND)

    // Update status to "Resolved"
    issue.status = 'Resolved'
    await issue.save()

    // Send email notification to the user
    await EmailUtil.sendResolutionEmail(issue.email, issue.title)

    return { message: 'Issue resolved and user notified' }
  } catch (error) {
    throw error
  }
}

const contactUserService = async (subject, message, issueId) => {
  try {
    // Validate required parameters
    validateRequiredParams({ subject, message, issueId })

    appAssert(validator.isMongoId(issueId), 'Invalid id format', HTTP_STATUS.NOT_FOUND)

    const issue = await IssueModel.findById(issueId)
    appAssert(issue, 'Issue not found', HTTP_STATUS.NOT_FOUND)

    appAssert(issue.email, 'Issue sender didnt provide an email', HTTP_STATUS.NOT_FOUND)

    // Sanitize inputs
    const sanitizedSubject = sanitizeHtml(subject.trim())
    const sanitizedMessage = sanitizeHtml(message.trim())
    const email = issue.email

    // Validate subject length
    appAssert(sanitizedSubject.length <= 50, 'Subject should be 50 characters max', HTTP_STATUS.BAD_REQUEST)

    await EmailUtil.sendContactMessage(email, sanitizedSubject, sanitizedMessage)
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveIssueService,
  fetchIssuesService,
  resolveIssueService,
  contactUserService,
}