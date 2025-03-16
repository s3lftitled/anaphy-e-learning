const mongoose = require('mongoose')

const UserActivitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userType: { 
    type: String, 
    enum: ['admin', 'student', 'teacher'], 
    required: true 
  },
  firstLogin: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  loginCount: { 
    type: Number, 
    default: 1 
  }
})

// Add indexes for query performance
UserActivitySchema.index({ userId: 1 }, { unique: true })
UserActivitySchema.index({ lastLogin: -1 })
UserActivitySchema.index({ userType: 1, lastLogin: -1 })

module.exports = mongoose.model('UserActivity', UserActivitySchema)