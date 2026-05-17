import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MessageBubble from "../components/Chat/MessageBubble";
import TypingIndicator from "../components/Chat/TypingIndicator";

export default function Onboarding() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [resumed, setResumed] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    initConversation();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const initConversation = async () => {
    setInitializing(true);
    try {
      const { data } = await api.get("/api/chat/history");
      if (data.completed) {
        navigate("/dashboard");
        return;
      }
      if (data.messages?.length > 0) {
        setMessages(data.messages);
        setResumed(true);
      } else await startFresh();
    } catch {
      await startFresh();
    } finally {
      setInitializing(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const startFresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/chat/onboarding", {});
      setMessages([{ role: "assistant", content: data.message }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || generating || initializing) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((p) => [...p, { role: "user", content: userMsg }]);
    setLoading(true);

    if (userMsg.toLowerCase() === "generate") {
      await handleGenerate();
      return;
    }

    try {
      const { data } = await api.post("/api/chat/onboarding", {
        message: userMsg,
      });
      setMessages((p) => [...p, { role: "assistant", content: data.message }]);
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

  const handleGenerate = async () => {
    setGenerating(true);
    setMessages((p) => [
      ...p,
      {
        role: "assistant",
        content:
          "✨ Perfect! Analysing everything you've shared and building your personalized career roadmap. This will take around 15 seconds...",
      },
    ]);
    try {
      await api.post("/api/roadmap/generate");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content:
            "Oops! Something went wrong. Type 'generate' again to retry.",
        },
      ]);
      setGenerating(false);
    } finally {
      setLoading(false);
    }
  };

  const placeholder = initializing
    ? "Loading..."
    : generating
      ? "Generating roadmap..."
      : loading
        ? "PathFinder is typing..."
        : "Your answer... (Enter to send)";

  if (initializing)
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center fade-up">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-soft text-sm font-body">
            Loading your conversation...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      {/* Header */}
      <div className="border-b border-border/60 px-6 py-4 flex items-center justify-between bg-midnight/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center">
            <span className="text-accent font-display font-bold text-sm">
              P
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">
              PathFinder AI
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span className="text-soft text-xs font-body">
                {generating
                  ? "Building your roadmap..."
                  : "Getting to know you..."}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-soft text-sm font-body">
            Hey, {user?.name?.split(" ")[0]} 👋
          </p>
          {messages.length >= 12 && !generating && (
            <p className="text-accent text-xs font-body mt-0.5 animate-pulse">
              Type <span className="font-semibold">"generate"</span> when ready
              ✨
            </p>
          )}
        </div>
      </div>

      {resumed && (
        <div className="bg-accent/10 border-b border-accent/20 px-6 py-2.5 text-center fade-in">
          <p className="text-accent text-xs font-body">
            👋 Welcome back! Resuming your conversation where you left off.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/60 px-4 py-4 bg-midnight/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={loading || generating || initializing}
            placeholder={placeholder}
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-white font-body text-sm
              focus:border-accent transition-colors placeholder:text-muted disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={loading || generating || initializing || !input.trim()}
            className="bg-accent text-midnight px-6 py-3 rounded-xl font-display font-bold text-sm
              hover:bg-accent-dim transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
