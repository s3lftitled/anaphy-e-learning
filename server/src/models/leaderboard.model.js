const mongoose = require('mongoose')

// Leaderboard Schema
const leaderboardSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  entries: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalScore: { type: Number, required: true }, // Combined score from quizzes and exam
    quizScores: Number,
    examScore: Number,
    rank: Number,
    lastUpdated: { type: Date, default: Date.now }
  }]
})

module.exports = mongoose.model('LeaderboardModel', leaderboardSchema)