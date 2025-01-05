const mongoose = require('mongoose')

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  description: String,
  order: { type: Number, required: true }, // For ordering lessons within topics
  content: [{
    type: { 
      type: String, 
      enum: ['page', 'quiz'], 
      required: true 
    },
    contentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'content.type' 
    },
    order: { type: Number, required: true } // For ordering pages and quizzes within lesson
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('LessonModel', lessonSchema)
