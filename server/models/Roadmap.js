const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title:       String,
  description: String,
  resources: [{
    title: String,
    url:   String,
    type:  { type: String,  default: "article" },
  }],
  jobLinks: [{ title: String, url: String }],
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const careerPathSchema = new mongoose.Schema({
  title:        String,
  description:  String,
  whyItFitsYou: String,
  milestones:   [milestoneSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    careerPaths:     [careerPathSchema],
    activePathIndex: { type: Number, default: 0 },
    overallProgress: { type: Number, default: 0 },
    lastUpdated:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
