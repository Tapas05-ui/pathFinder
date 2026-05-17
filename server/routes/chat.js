const express      = require("express");
const OpenAI       = require("openai");
const auth         = require("../middleware/auth");
const Conversation = require("../models/Conversation");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are PathFinder, a warm and insightful career mentor for students and fresh graduates.
Your job is to have a natural, friendly conversation to understand who this student is.

RULES:
- Ask ONE question at a time. Never ask two questions in one message.
- React to their answer with genuine interest before moving on.
- Be warm and conversational — like a trusted mentor, not a job interviewer.
- Keep responses short (2–4 sentences max).

COVER THESE AREAS naturally:
1. What subjects or activities they genuinely enjoy
2. Past projects, achievements, or things they are proud of
3. Personality — working alone or in teams, creative or analytical
4. Any career ideas they have had (even vague ones)
5. Current education level and existing skills

ENDING: After 6–8 meaningful exchanges covering all 5 areas, end with EXACTLY this message:
"Thanks for sharing all of this with me! I have a great picture of who you are and what drives you. Type 'generate' whenever you're ready and I'll create your personalized career roadmap! 🚀"`;

// POST /api/chat/onboarding
router.post("/onboarding", auth, async (req, res) => {
  try {
    const { message } = req.body;

    let conv = await Conversation.findOne({ userId: req.userId, type: "onboarding", completed: false });
    if (!conv) conv = await Conversation.create({ userId: req.userId, type: "onboarding", messages: [] });

    if (message?.trim()) {
      conv.messages.push({ role: "user", content: message.trim() });
      await conv.save();
    }

    // Build messages array for OpenAI
    const history = conv.messages.length > 0
      ? conv.messages.map((m) => ({ role: m.role, content: m.content }))
      : [{ role: "user", content: "Hi, I want to discover my career path." }];

    const response = await openai.chat.completions.create({
      model:    "gpt-3.5-turbo",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      max_tokens:  500,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    conv.messages.push({ role: "assistant", content: reply });
    await conv.save();

    res.json({ message: reply, conversationId: conv._id, messageCount: conv.messages.length });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/chat/history
router.get("/history", auth, async (req, res) => {
  try {
    const conv = await Conversation.findOne({ userId: req.userId, type: "onboarding" }).sort({ createdAt: -1 });
    if (!conv) return res.json({ messages: [], completed: false });
    res.json({ messages: conv.messages, completed: conv.completed, conversationId: conv._id });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/chat/reset
router.delete("/reset", auth, async (req, res) => {
  try {
    await Conversation.deleteMany({ userId: req.userId, type: "onboarding" });
    res.json({ message: "Conversation reset" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;