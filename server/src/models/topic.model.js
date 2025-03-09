const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 600 },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LessonModel' }],
}, {
  timestamps: true,
})

// Index on name for faster searches
topicSchema.index({ name: 1 })

module.exports = mongoose.model('TopicModel', topicSchema)
