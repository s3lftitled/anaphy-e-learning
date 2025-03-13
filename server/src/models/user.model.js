const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, maxlength: 35, minlength: 6, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "student" },
  verificationCode: { type: String },
  profilePicture: { type: String },

  // Invitations array (pending invites)
  invitations: [
    {
      classId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassModel" },
      classCode: { type: String },
      status: { type: String, enum: ["invited", "accepted", "rejected"], default: "invited" },
      invitedAt: { type: Date, default: Date.now }
    }
  ],

  pendingApproval: [
    {
      classId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassModel" },
      classCode: { type: String },
      status: { type: String, enum: ["accepted", "rejected", "pending"], default: "pending" },
      requestedAt: { type: Date, default: Date.now }
    }
  ],

  // Joined classes
  joinedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClassModel" }]
})

module.exports = mongoose.model("UserModel", userSchema)
