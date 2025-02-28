const mongoose = require("mongoose")

const ClassSchema = new mongoose.Schema({
  name: { type: String, maxlength: 14, minlength: 6 },
  code: { type: String, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  grades: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      scores: [
        {
          type: Number, // Stores individual grades (quiz, assignment, etc.)
        },
      ],
      finalGrade: { type: Number, default: 0 }, // Stores overall class grade
    },
  ],
})

module.exports = mongoose.model("ClassModel", ClassSchema)
