const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }, 
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
})

module.exports = mongoose.model('TopicModel', topicSchema)
