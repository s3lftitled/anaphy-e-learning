const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')

const findMissingParams = (params) => {
  const missingParams = Object.keys(params).filter(
    key => params[key] === undefined || params[key] === null || params[key].toString().trim() === ''
  )
  return missingParams.length ? missingParams : null
}

const validateRequiredParams = (requiredParams, errorMessage = 'Please fill in all the required fields') => {
  const missingParams = findMissingParams(requiredParams)
  appAssert(!missingParams, errorMessage, HTTP_STATUS.BAD_REQUEST)
}


module.exports = { validateRequiredParams }
