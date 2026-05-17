export default function CareerPathTabs({ paths, activeTab, onSelect }) {
  if (!paths || paths.length <= 1) return null;
  return (
    <div className="fade-up-2">
      <p className="text-muted text-xs font-body uppercase tracking-widest mb-3">Career Paths</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {paths.map((path, i) => {
          const done  = path.milestones.filter((m) => m.completed).length;
          const total = path.milestones.length;
          const pct   = total ? Math.round((done / total) * 100) : 0;
          const isActive = activeTab === i;
          return (
            <button key={i} onClick={() => onSelect(i)}
              className={`flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-xl border text-left
                transition-all duration-200 min-w-[160px]
                ${isActive ? "bg-accent text-midnight border-accent scale-[1.02]" : "bg-card text-soft border-border hover:border-accent/40 hover:text-white"}`}>
              <span className={`font-display font-semibold text-sm leading-tight mb-2 ${isActive ? "text-midnight" : ""}`}>{path.title}</span>
              <div className={`w-full h-1 rounded-full ${isActive ? "bg-midnight/20" : "bg-border"}`}>
                <div className={`h-1 rounded-full transition-all duration-500 ${isActive ? "bg-midnight/60" : "bg-accent"}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-xs font-body mt-1.5 ${isActive ? "text-midnight/70" : "text-muted"}`}>{pct}% complete</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
