import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent rounded-full blur-[140px] opacity-[0.05] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md fade-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-midnight font-display font-black text-sm">P</span>
          </div>
          <span className="font-display font-bold text-xl text-white">Path<span className="text-accent">Finder</span></span>
        </Link>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h2 className="font-display font-bold text-2xl text-white mb-1">{title}</h2>
          <p className="text-soft text-sm font-body mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
