const mongoose = require("mongoose");

const skillSnapshotSchema = new mongoose.Schema({
  date:   { type: Date, default: Date.now },
  skills: [String],
  level:  { type: Number, default: 0 }, // 0-100 overall skill score
});

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profile: {
      skills:     [String],
      interests:  [String],
      education:  String,
      experience: String,
    },
    skillHistory:       [skillSnapshotSchema], // Phase 4: track skill growth over time
    onboardingComplete: { type: Boolean, default: false },
    lastCheckIn:        { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
