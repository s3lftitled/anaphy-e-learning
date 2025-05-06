const mongoose = require("mongoose")

const ClassSchema = new mongoose.Schema({
  name: { type: String, maxlength: 14, minlength: 6 },
  code: { type: String, unique: true },
  description: { type: String},
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherModel" },
  announcements: [
    { 
      title: { type: String, required: true},
      message: { type: String, required: true }, 
      createdAt: { type: Date, default: Date.now }
    }
  ],
  students: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
      status: {
        type: String,
        enum: ["invited", "rejected", "joined", "pending"],
        default: "invited",
      },
      createdAt: { type: Date, default: Date.now }
    },
  ],
  grades: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
      scores: [{ type: Number }], // Stores individual grades (quiz, assignment, etc.)
      finalGrade: { type: Number, default: 0 }, // Stores overall class grade
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("ClassModel", ClassSchema)
