const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
  name: { type: String, maxlength: 35, minlength: 6 },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'active'], default: 'pending' },
  role: { type: String, default: 'teacher'},
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClassModel" }],
  confirmationToken: { type: String }, // Store token for verification
  tokenExpires: { type: Date }, // Set expiration time for security
  resetPasswordToken: { type: String, default: undefined},
  resetPasswordExpires: { type: Date, default: undefined },
})

module.exports = mongoose.model('TeacherModel', teacherSchema)
