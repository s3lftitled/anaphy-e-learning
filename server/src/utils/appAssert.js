class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

const appAssert = (condition, message, statusCode) => {
  if (!condition) throw new AppError(message, statusCode)
}

module.exports = { appAssert }
