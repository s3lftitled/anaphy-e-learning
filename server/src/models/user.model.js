const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },  
  verificationCode: { type: String }
})

module.exports = mongoose.model('UserModel', userSchema)
