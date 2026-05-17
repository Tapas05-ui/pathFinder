const express      = require("express");
const OpenAI       = require("openai");
const auth         = require("../middleware/auth");
const Conversation = require("../models/Conversation");
const Roadmap      = require("../models/Roadmap");
const User         = require("../models/User");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/checkin/start
router.post("/start", auth, async (req, res) => {
  try {
    const [user, roadmap] = await Promise.all([
      User.findById(req.userId).select("-password"),
      Roadmap.findOne({ userId: req.userId }),
    ]);

    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });

    const activePath          = roadmap.careerPaths[roadmap.activePathIndex];
    const completedMilestones = activePath.milestones.filter((m) => m.completed).map((m) => m.title);
    const pendingMilestones   = activePath.milestones.filter((m) => !m.completed).map((m) => m.title);

    const systemPrompt = `You are PathFinder, a supportive career mentor doing a weekly check-in with ${user.name}.

Their current career path: ${activePath.title}
Overall progress: ${roadmap.overallProgress}%
Completed milestones: ${completedMilestones.join(", ") || "None yet"}
Pending milestones: ${pendingMilestones.join(", ")}

Your job:
1. Start with a warm encouraging greeting that acknowledges their specific progress.
2. Ask ONE specific question about what they've been working on this week.
3. Based on their answers, give specific advice and encouragement.
4. After 3-4 exchanges, wrap up naturally.
5. Keep each message to 2-4 sentences. Be warm but focused.
Do NOT ask generic questions. Reference their actual milestones.`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let conv = await Conversation.findOne({
      userId: req.userId, type: "checkin", createdAt: { $gte: today }, completed: false,
    });

    if (!conv) conv = await Conversation.create({ userId: req.userId, type: "checkin", messages: [] });

    if (conv.messages.length > 0) {
      return res.json({ message: conv.messages[conv.messages.length - 1].content, conversationId: conv._id, messages: conv.messages });
    }

    const response = await openai.chat.completions.create({
      model:    "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: "Hey, I'm ready for my weekly check-in." },
      ],
      max_tokens: 400, temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    conv.messages.push({ role: "assistant", content: reply });
    await conv.save();

    await User.findByIdAndUpdate(req.userId, { lastCheckIn: new Date() });

    res.json({ message: reply, conversationId: conv._id, messages: conv.messages });
  } catch (err) {
    console.error("Checkin start error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/checkin/message
router.post("/message", auth, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: "Message is required" });

    const [user, roadmap, conv] = await Promise.all([
      User.findById(req.userId).select("-password"),
      Roadmap.findOne({ userId: req.userId }),
      Conversation.findById(conversationId),
    ]);

    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    const activePath          = roadmap.careerPaths[roadmap.activePathIndex];
    const completedMilestones = activePath.milestones.filter((m) => m.completed).map((m) => m.title);
    const pendingMilestones   = activePath.milestones.filter((m) => !m.completed).map((m) => m.title);

    const systemPrompt = `You are PathFinder, a supportive career mentor doing a weekly check-in with ${user.name}.
Career path: ${activePath.title} | Progress: ${roadmap.overallProgress}%
Completed: ${completedMilestones.join(", ") || "None yet"}
Pending: ${pendingMilestones.join(", ")}
Be warm and specific. Keep responses to 2-4 sentences.
After 3-4 exchanges, wrap up with: "Great check-in! Keep up the momentum. See you next week! 🚀"`;

    conv.messages.push({ role: "user", content: message.trim() });

    const history = conv.messages.map((m) => ({ role: m.role, content: m.content }));

    const response = await openai.chat.completions.create({
      model:    "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }, ...history],
      max_tokens: 400, temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    conv.messages.push({ role: "assistant", content: reply });

    if (reply.includes("See you next week")) conv.completed = true;
    await conv.save();

    res.json({ message: reply, conversationId: conv._id, completed: conv.completed });
  } catch (err) {
    console.error("Checkin message error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/checkin/status
router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("lastCheckIn skillHistory");
    const lastCheckIn = user?.lastCheckIn;
    const now = new Date();
    const daysSince = lastCheckIn
      ? Math.floor((now - new Date(lastCheckIn)) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      lastCheckIn,
      daysSince,
      isDue:        daysSince === null || daysSince >= 7,
      skillHistory: user?.skillHistory || [],
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;