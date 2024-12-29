const mongoose = require('mongoose')
const logger = require('../logger/logger')

const connectDB = (url) => {
  return (
    mongoose.connect(url).then(() => {
      logger.info('Connected to Database')
    }).catch((error) => console.log(error))
  )
}

module.exports = connectDB