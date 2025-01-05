const mongoose = require('mongoose')

// Page Schema
const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    caption: String,
    altText: String,
    position: { type: Number, required: true } // For ordering images within the page
  }],
  videos: [{
    url: { type: String, required: true },
    caption: String,
    duration: Number,
    position: { type: Number, required: true } // For ordering videos within the page
  }]
})

module.exports = mongoose.model('PageModel', pageSchema)
