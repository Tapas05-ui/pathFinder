import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MessageBubble from "../components/Chat/MessageBubble";
import TypingIndicator from "../components/Chat/TypingIndicator";
import Navbar from "../components/Dashboard/Navbar";

export default function CheckIn() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const init = async () => {
    setInitializing(true);
    try {
      const { data: statusData } = await api.get("/checkin/status");
      setStatus(statusData);

      const { data } = await api.post("/api/checkin/start");
      setMessages([{ role: "assistant", content: data.message }]);
      setConversationId(data.conversationId);
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || completed || initializing) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((p) => [...p, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post("/api/checkin/message", {
        message: userMsg,
        conversationId,
      });
      setMessages((p) => [...p, { role: "assistant", content: data.message }]);
      if (data.completed) setCompleted(true);
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (initializing)
    return (
      <div className="min-h-screen bg-midnight flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center fade-up">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-soft text-sm font-body">
              Starting your check-in...
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <Navbar />

      {/* Check-in header */}
      <div className="border-b border-border/60 px-6 py-4 flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center">
            <span className="text-lg">🔁</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">
              Weekly Check-in
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span className="text-soft text-xs font-body">
                {completed
                  ? "Check-in complete!"
                  : "PathFinder is reviewing your progress..."}
              </span>
            </div>
          </div>
        </div>
        {status && (
          <div className="text-right">
            <p className="text-muted text-xs font-body">
              {status.lastCheckIn
                ? `Last: ${new Date(status.lastCheckIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                : "First check-in!"}
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && <TypingIndicator />}

          {/* Completion state */}
          {completed && !loading && (
            <div className="fade-in text-center py-6">
              <div className="w-16 h-16 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Check-in complete!
              </h3>
              <p className="text-soft text-sm font-body mb-6">
                Great job staying on track. See you next week!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-accent text-midnight font-display font-bold px-6 py-3 rounded-xl hover:bg-accent-dim transition-all hover:scale-105 duration-200"
              >
                Back to Dashboard →
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      {!completed && (
        <div className="border-t border-border/60 px-4 py-4 bg-midnight/80 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              disabled={loading || initializing || completed}
              placeholder={
                loading
                  ? "PathFinder is typing..."
                  : "Share what you've been working on..."
              }
              className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-white font-body text-sm
                focus:border-accent transition-colors placeholder:text-muted disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={loading || initializing || completed || !input.trim()}
              className="bg-accent text-midnight px-6 py-3 rounded-xl font-display font-bold text-sm
                hover:bg-accent-dim transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
