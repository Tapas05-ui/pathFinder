export default function ProgressCard({ careerTitle, completed, total }) {
  const progress = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="bg-card border border-border rounded-2xl p-6 fade-up-1">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-muted text-xs font-body uppercase tracking-widest mb-1">Active Path</p>
          <h2 className="font-display font-bold text-xl text-white leading-tight max-w-xs">{careerTitle}</h2>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <span className="font-display font-extrabold text-4xl text-accent">{progress}%</span>
          <p className="text-muted text-xs font-body mt-1">{completed} / {total} done</p>
        </div>
      </div>
      <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden mb-3">
        <div className="h-2.5 rounded-full bg-gradient-to-r from-accent-dim to-accent transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }} />
      </div>
      {total > 0 && (
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < completed ? "bg-accent" : "bg-border"}`} />
          ))}
        </div>
      )}
      {progress === 100 && (
        <div className="mt-4 bg-accent/10 border border-accent/20 rounded-xl px-4 py-2.5 text-center fade-in">
          <p className="text-accent text-sm font-body">🎉 Path complete! Ready for the next chapter.</p>
        </div>
      )}
    </div>
  );
}
