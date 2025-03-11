const mongoose = require('mongoose')

// User Progress Schema
const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  completedContent: [{
    contentType: { type: String, enum: ['page', 'quiz'] },
    contentId: { type: mongoose.Schema.Types.ObjectId },
    completedAt: { type: Date, default: Date.now }
  }],
  quizResults: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    passed: Boolean,
    attempts: Number,
    lastAttemptAt: Date
  }],
  examResult: {
    score: Number,
    passed: Boolean,
    completedAt: Date,
    attempts: Number
  },
  lastViewed: {
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    timestamp: { type: Date, default: Date.now }
  }
})

module.exports = mongoose.model('UserProgressModel', userProgressSchema)