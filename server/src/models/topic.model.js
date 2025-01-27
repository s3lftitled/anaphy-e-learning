const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 30 },
  description: { type: String, trim: true, maxlength: 200 },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
}, {
  timestamps: true,
})

// Index on name for faster searches
topicSchema.index({ name: 1 })

module.exports = mongoose.model('TopicModel', topicSchema)
