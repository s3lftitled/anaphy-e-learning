const mongoose = require('mongoose')

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  timeLimit: Number, // in minutes
  passingScore: { type: Number, required: true },
  questions: [{
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['multiple-choice', 'true-false', 'matching'], required: true },
    options: [String],
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    points: { type: Number, default: 1 },
    explanation: String // Explanation for the correct answer
  }]
})

module.exports = mongoose.model('QuizModel', quizSchema)
