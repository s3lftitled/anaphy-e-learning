const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  issueType: { type: String, enum: ['Question', 'Feature Request', 'Bug Report', 'Other']},
  title: { type: String, maxLength: 50 },
  description:{ type: String },
  email: { type: String }
})

module.exports = mongoose.model('IssueModel', issueSchema)