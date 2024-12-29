const bcrypt = require('bcrypt')
const logger = require('../logger/logger')

class PasswordUtil {
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, 10)
    } catch (error) {
      logger.error('Error hashing password:', error)
      throw new Error('Failed to hash password.')
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

module.exports = new PasswordUtil()
