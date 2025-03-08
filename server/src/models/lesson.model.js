const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'TopicModel', required: true },
  description: { type: String, trim: true }, 
  order: { type: Number, required: true },
  content: [{
    type: {
      type: String,
      enum: ['page', 'quiz'],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'content.type',
    },
    order: { type: Number, required: true },
  }],
}, {
  timestamps: true,
})

lessonSchema.index({ topic: 1, order: 1 })

module.exports = mongoose.model('LessonModel', lessonSchema)
