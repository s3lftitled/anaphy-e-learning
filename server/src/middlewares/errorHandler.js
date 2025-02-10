const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

const errorHandler = (err, req, res, next) => { 
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  const message = err.message || 'Something went wrong!'

  logger.error(`Error: ${message}`)

  res.status(statusCode).json({ 
    success: false, 
    message, 
    errors: err.errors || null 
  })
}

module.exports = errorHandler
