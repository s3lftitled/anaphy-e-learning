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
    if (!plainPassword || !hashedPassword) {
      throw new Error('Missing arguments: plainPassword and hashedPassword are required')
    }
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

module.exports = new PasswordUtil()
