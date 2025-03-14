const mongoose = require("mongoose")

const ClassSchema = new mongoose.Schema({
  name: { type: String, maxlength: 14, minlength: 6 },
  code: { type: String, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  students: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
      status: {
        type: String,
        enum: ["invited", "rejected", "joined", "pending"],
        default: "invited",
      },
    },
  ],
  grades: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
      scores: [{ type: Number }], // Stores individual grades (quiz, assignment, etc.)
      finalGrade: { type: Number, default: 0 }, // Stores overall class grade
    },
  ],
})

module.exports = mongoose.model("ClassModel", ClassSchema)
