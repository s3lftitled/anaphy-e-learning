const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  issueType: { type: String, enum: ['Question', 'Feature Request', 'Bug Report', 'Other']},
  title: { type: String, maxLength: 50 },
  description:{ type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now},
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
})

module.exports = mongoose.model('IssueModel', issueSchema)