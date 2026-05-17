export default function TypingIndicator() {
  return (
    <div className="flex justify-start items-end gap-2 fade-in">
      <div className="w-7 h-7 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-accent text-xs font-display font-bold">P</span>
      </div>
      <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 150, 300].map((d) => (
            <span key={d} className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
