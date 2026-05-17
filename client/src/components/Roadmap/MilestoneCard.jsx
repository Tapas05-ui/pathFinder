export default function MilestoneCard({ milestone, index, pathIndex, onComplete, onUndo }) {
  const { title, description, resources = [], jobLinks = [], completed, completedAt } = milestone;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className={`group bg-card border rounded-2xl p-5 transition-all duration-300
      ${completed ? "border-accent/20 bg-accent/[0.02]" : "border-border hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => completed ? onUndo(pathIndex, index) : onComplete(pathIndex, index)}
          title={completed ? "Click to undo" : "Click to complete"}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 transition-all duration-200 flex items-center justify-center
            ${completed ? "bg-accent border-accent hover:bg-accent/80" : "border-border hover:border-accent hover:scale-110"}`}>
          {completed && <span className="text-midnight text-xs font-bold leading-none">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-surface border border-border text-muted text-[10px] font-body px-2 py-0.5 rounded-full uppercase tracking-widest">
              Step {index + 1}
            </span>
            {completed && completedAt && (
              <span className="text-muted text-[10px] font-body">Completed {formatDate(completedAt)}</span>
            )}
          </div>
          <h4 className={`font-display font-semibold text-sm mb-2 ${completed ? "line-through text-muted" : "text-white"}`}>{title}</h4>
          <p className={`text-sm font-body leading-relaxed mb-4 ${completed ? "text-muted" : "text-soft"}`}>{description}</p>

          {resources.length > 0 && (
            <div className="mb-3">
              <p className="text-muted text-[10px] font-body uppercase tracking-widest mb-2">📚 Resources</p>
              <div className="flex flex-wrap gap-2">
                {resources.map((r, ri) => (
                  <a key={ri} href={r.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-surface border border-border text-accent px-3 py-1.5 rounded-full
                      hover:border-accent hover:bg-accent/10 transition-all duration-200 font-body">
                    <span className="text-[10px]">{r.type === "video" ? "▶" : r.type === "course" ? "🎓" : "📄"}</span>
                    {r.title} ↗
                  </a>
                ))}
              </div>
            </div>
          )}

          {jobLinks.length > 0 && (
            <div>
              <p className="text-muted text-[10px] font-body uppercase tracking-widest mb-2">💼 Jobs & Internships</p>
              <div className="flex flex-wrap gap-2">
                {jobLinks.map((j, ji) => (
                  <a key={ji} href={j.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs bg-surface border border-border text-soft px-3 py-1.5 rounded-full
                      hover:border-soft hover:text-white transition-all duration-200 font-body">
                    {j.title} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
