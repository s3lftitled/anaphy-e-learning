const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  link: { type: String },
  images: [{
    url: { type: String, required: true, validate: /^(http|https):\/\// },
    caption: { type: String, trim: true },
    altText: { type: String, trim: true },
    position: { type: Number, required: true },
  }],
  videos: [{
    url: { type: String, required: true, validate: /^(http|https):\/\// },
    caption: { type: String, trim: true },
    duration: { type: Number, min: 0 },
    position: { type: Number, required: true },
  }],
}, {
  timestamps: true,
})

// Index on title for search efficiency
pageSchema.index({ title: 1 })

module.exports = mongoose.model('PageModel', pageSchema)
