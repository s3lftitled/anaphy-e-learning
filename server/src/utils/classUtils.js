const ClassModel = require('../models/class.model')

/**
 * Generates a unique class code
 */
const generateUniqueClassCode = async () => {
  let code
  let isUnique = false

  while (!isUnique) {
    // Generate a random 6-character alphanumeric code
    code = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Check if code already exists in the database
    const existingClass = await ClassModel.findOne({ code })
    if (!existingClass) isUnique = true
  }

  return code;
}

module.exports = { generateUniqueClassCode }
