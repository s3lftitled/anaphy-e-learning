const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  timeLimit: { type: Number, min: 1 },
  passingScore: { type: Number, required: true, min: 0 },
  questions: [{
    questionText: { type: String, required: true },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'matching'],
      required: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (options) {
          return this.questionType === 'multiple-choice' ? options.length > 0 : true
        },
        message: 'Options are required for multiple-choice questions.',
      },
    },
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    points: { type: Number, default: 1 },
    explanation: { type: String, trim: true },
  }],
}, {
  timestamps: true,
})

// Index on title for quick lookups
quizSchema.index({ title: 1 })

module.exports = mongoose.model('Quiz', quizSchema)
