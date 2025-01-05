const mongoose = require('mongoose')

// Exam Schema (Final exam for each topic)
const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  timeLimit: { type: Number, required: true }, // in minutes
  passingScore: { type: Number, required: true },
  questions: [{
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['multiple-choice', 'true-false', 'matching'], required: true },
    options: [String],
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    points: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }
  }]
})

module.exports = mongoose.model('ExamModel', examSchema)
