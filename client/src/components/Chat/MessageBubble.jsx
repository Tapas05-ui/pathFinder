export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} fade-in`}>
      {!isUser && (
        <div className="w-7 h-7 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-accent text-xs font-display font-bold">P</span>
        </div>
      )}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed
        ${isUser ? "bg-accent text-midnight font-medium rounded-br-sm" : "bg-card border border-border text-white rounded-bl-sm"}`}>
        {content}
      </div>
    </div>
  );
}
