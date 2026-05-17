const express      = require("express");
const OpenAI       = require("openai");
const auth         = require("../middleware/auth");
const Roadmap      = require("../models/Roadmap");
const Conversation = require("../models/Conversation");
const User         = require("../models/User");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/roadmap/generate
router.post("/generate", auth, async (req, res) => {
  try {
    // Find the most recent onboarding conversation (completed or not)
    const conv = await Conversation.findOne({
      userId: req.userId,
      type:   "onboarding",
    }).sort({ createdAt: -1 });

    // Lowered threshold to 2 — even a short chat can generate a roadmap
    if (!conv || conv.messages.length < 2) {
      return res.status(400).json({
        message: "Please have a short conversation first before generating your roadmap.",
      });
    }

    const transcript = conv.messages
      .map((m) => `${m.role === "user" ? "Student" : "Mentor"}: ${m.content}`)
      .join("\n\n");

    const prompt = `You are a career advisor. Based on the following conversation, generate a personalized career roadmap.

CONVERSATION:
${transcript}

INSTRUCTIONS:
- Generate exactly 2 career paths that fit this student.
- Each path must have exactly 5 milestones ordered from beginner to advanced.
- "whyItFitsYou" must reference specific things the student mentioned.
- Resources must be real platforms (Coursera, freeCodeCamp, YouTube, MDN, Udemy).
- Job links should use real job boards (LinkedIn, Internshala, Indeed, Naukri).
- Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

REQUIRED JSON FORMAT:
{
  "careerPaths": [
    {
      "title": "Career path name",
      "description": "2-sentence description of this career",
      "whyItFitsYou": "Why this fits the student based on what they said",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "What to learn and do in 3-4 sentences",
          "resources": [
            { "title": "Resource name", "url": "https://real-url.com", "type": "course" }
          ],
          "jobLinks": [
            { "title": "Job title", "url": "https://linkedin.com/jobs/search/?keywords=developer" }
          ]
        }
      ]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role:    "system",
          content: "You are a career advisor. Always respond with valid JSON only. No markdown, no backticks, no explanation whatsoever.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens:  4000,
      temperature: 0.7,
    });

    const raw   = response.choices[0].message.content.trim();
    const clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i,     "")
      .replace(/```\s*$/i,     "")
      .trim();

    let data;
    try {
      data = JSON.parse(clean);
    } catch (parseErr) {
      console.error("JSON parse error. Raw response:", raw);
      return res.status(500).json({ message: "AI returned invalid data. Please try again." });
    }

    if (!data.careerPaths?.length) {
      return res.status(500).json({ message: "AI did not return career paths. Please try again." });
    }

    // Save or update roadmap
    let roadmap = await Roadmap.findOne({ userId: req.userId });
    if (roadmap) {
      roadmap.careerPaths     = data.careerPaths;
      roadmap.activePathIndex = 0;
      roadmap.overallProgress = 0;
      roadmap.lastUpdated     = new Date();
    } else {
      roadmap = new Roadmap({
        userId:          req.userId,
        careerPaths:     data.careerPaths,
        activePathIndex: 0,
        overallProgress: 0,
      });
    }
    await roadmap.save();

    // Mark onboarding complete
    await User.findByIdAndUpdate(req.userId, { onboardingComplete: true });
    conv.completed = true;
    await conv.save();

    return res.status(201).json(roadmap);
  } catch (err) {
    console.error("Generate roadmap error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/roadmap
router.get("/", auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.userId });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });
    return res.json(roadmap);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/roadmap/active-path
router.patch("/active-path", auth, async (req, res) => {
  try {
    const { pathIndex } = req.body;
    const roadmap = await Roadmap.findOne({ userId: req.userId });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });

    roadmap.activePathIndex = pathIndex;
    const path = roadmap.careerPaths[pathIndex];
    if (path) {
      const done = path.milestones.filter((m) => m.completed).length;
      roadmap.overallProgress = Math.round((done / path.milestones.length) * 100);
    }
    await roadmap.save();
    return res.json(roadmap);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/roadmap/milestone/:p/:m/complete
router.patch("/milestone/:pathIndex/:milestoneIndex/complete", auth, async (req, res) => {
  try {
    const pIdx = parseInt(req.params.pathIndex);
    const mIdx = parseInt(req.params.milestoneIndex);

    const roadmap = await Roadmap.findOne({ userId: req.userId });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });

    const milestone = roadmap.careerPaths[pIdx]?.milestones[mIdx];
    if (!milestone) return res.status(404).json({ message: "Milestone not found" });

    milestone.completed   = true;
    milestone.completedAt = new Date();

    const path = roadmap.careerPaths[pIdx];
    const done = path.milestones.filter((m) => m.completed).length;
    roadmap.overallProgress = Math.round((done / path.milestones.length) * 100);
    roadmap.lastUpdated     = new Date();
    await roadmap.save();

    // Update skill snapshot on user
    const user = await User.findById(req.userId);
    if (user) {
      const allMilestones = roadmap.careerPaths.flatMap((p) => p.milestones);
      const totalDone     = allMilestones.filter((m) => m.completed).length;
      const level         = Math.round((totalDone / allMilestones.length) * 100);
      user.skillHistory.push({ date: new Date(), skills: user.profile?.skills || [], level });
      await user.save();
    }

    return res.json(roadmap);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/roadmap/milestone/:p/:m/undo
router.patch("/milestone/:pathIndex/:milestoneIndex/undo", auth, async (req, res) => {
  try {
    const pIdx = parseInt(req.params.pathIndex);
    const mIdx = parseInt(req.params.milestoneIndex);

    const roadmap = await Roadmap.findOne({ userId: req.userId });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });

    const milestone = roadmap.careerPaths[pIdx]?.milestones[mIdx];
    if (!milestone) return res.status(404).json({ message: "Milestone not found" });

    milestone.completed   = false;
    milestone.completedAt = null;

    const path = roadmap.careerPaths[pIdx];
    const done = path.milestones.filter((m) => m.completed).length;
    roadmap.overallProgress = Math.round((done / path.milestones.length) * 100);
    roadmap.lastUpdated     = new Date();
    await roadmap.save();

    return res.json(roadmap);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;