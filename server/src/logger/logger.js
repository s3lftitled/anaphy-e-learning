const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize } = format

// Define custom log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'blue',
  verbose: 'magenta',
  silly: 'gray'
}

require('winston').addColors(colors)

// Function to format stack trace to be more readable
const formatStack = (stack) => {
  if (!stack) return ''
  return stack
    .split('\n')
    .slice(0, 4)  // Take first 4 lines of stack trace
    .map(line => line.trim())
    .join('\n    ')  // Indent stack lines
}

// Create the logger
const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize({
          all: false,
          colors: colors,
          level: true
        }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => {
          // Base log line with timestamp and level
          let output = `${info.timestamp} [${info.level}]`

          // Add HTTP Error prefix if present
          if (info.prefix === 'HTTP Error') {
            output += ' [HTTP Error]'
          }

          // Add main error message
          output += ` ${info.message}`

          // Add request details if present
          if (info.method && info.route) {
            output += `\n    Route: ${info.method} ${info.route}`
          }

          // Add status code if present
          if (info.statusCode) {
            output += `\n    Status: ${info.statusCode}`
          }

          // Add IP if present
          if (info.ip) {
            output += `\n    IP: ${info.ip}`
          }

          // Add formatted stack trace if present
          if (info.stack) {
            output += '\n    Stack:\n    ' + formatStack(info.stack)
          }

          return output
        })
      ),
    }),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: format.uncolorize() // Remove colors for file output
    }),
    new transports.File({ 
      filename: 'logs/combined.log',
      format: format.uncolorize() // Remove colors for file output
    })
  ]
})

// Middleware function to log HTTP requests
logger.logRequest = (req, res, next) => {
  logger.info(`Incoming ${req.method} request`, {
    method: req.method,
    route: req.originalUrl,
    query: Object.keys(req.query).length ? req.query : undefined,
    ip: req.ip
  })
  next()
}

// Method to log errors with additional details
logger.logError = (error, req) => {
  logger.error(error.message || 'Unknown error', {
    prefix: 'HTTP Error',
    stack: error.stack,
    route: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode: error.statusCode || 500
  })
}

module.exports = logger