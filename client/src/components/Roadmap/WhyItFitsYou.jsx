export default function WhyItFitsYou({ text }) {
  if (!text) return null;
  return (
    <div className="fade-up-3 bg-gradient-to-r from-accent/5 to-emerald-500/5 border border-accent/20 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">✨</span>
        <div>
          <p className="text-accent text-xs font-body uppercase tracking-widest mb-1.5 font-medium">Why this fits you</p>
          <p className="text-white/80 text-sm font-body leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
