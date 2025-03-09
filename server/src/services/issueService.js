const IssueModel = require('../models/issue.model')
const HTTP_STATUS = require('../constants/httpConstants')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')

const VALID_TYPES = ['Question', 'Feature Request', 'Bug Report', 'Other']

const saveIssueService = async (type, title, description, email) => {
  try {
    console.log(type, title, description, email)
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
    // Log the error for debugging purposes
    console.error('Error in saveIssueService:', error.message)
    throw error
  }
}

module.exports = {
  saveIssueService,
}