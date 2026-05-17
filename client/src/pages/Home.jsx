import { Link } from "react-router-dom";

const Feature = ({ icon, title, desc, delay }) => (
  <div
    className={`fade-up-${delay} group bg-card border border-border rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1`}
  >
    <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
      <span className="text-lg">{icon}</span>
    </div>
    <h3 className="font-display font-semibold text-white text-sm mb-2">
      {title}
    </h3>
    <p className="text-soft text-xs font-body leading-relaxed">{desc}</p>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight overflow-hidden relative">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent rounded-full blur-[160px] opacity-[0.06] float pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-emerald-300 rounded-full blur-[120px] opacity-[0.05] float-2 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-8 py-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-midnight font-display font-black text-xs">
                P
              </span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Path<span className="text-accent">Finder</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-soft hover:text-white transition-colors text-sm font-body px-4 py-2 rounded-lg hover:bg-card"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-accent text-midnight font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-accent-dim transition-all hover:scale-105 duration-200"
            >
              Get started →
            </Link>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="fade-up-1 inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-accent text-xs font-body tracking-widest uppercase font-medium">
              AI-Powered Career Guidance
            </span>
          </div>

          <h1 className="fade-up-2 font-display font-extrabold text-5xl md:text-[72px] leading-[1.05] text-white max-w-4xl mb-6">
            Your career path,
            <br />
            <span className="shimmer-text">remembered forever.</span>
          </h1>

          <div className="fade-up-4 flex flex-col sm:flex-row gap-4 mb-20">
            <Link
              to="/register"
              className="glow-btn bg-accent text-midnight font-display font-bold text-base px-9 py-4 rounded-xl hover:bg-accent-dim transition-all duration-300 hover:scale-105"
            >
              Discover your path
            </Link>
            <Link
              to="/login"
              className="border border-border text-soft font-body text-base px-9 py-4 rounded-xl hover:border-accent/50 hover:text-white transition-all duration-300 bg-card/50"
            >
              I have an account
            </Link>
          </div>

          <div className="fade-up-5 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
            <Feature
              delay={1}
              icon="💬"
              title="Conversational AI"
              desc="No forms. Just a natural chat that discovers who you really are."
            />
            <Feature
              delay={2}
              icon="🗺️"
              title="Personalized Roadmap"
              desc="A step-by-step career plan built around your strengths."
            />
            <Feature
              delay={3}
              icon="📈"
              title="Progress Tracking"
              desc="Mark milestones, watch your growth, see how far you've come."
            />
            <Feature
              delay={4}
              icon="🔁"
              title="Weekly Check-ins"
              desc="AI remembers you and updates your guidance as you evolve."
            />
          </div>
        </main>

        <footer className="border-t border-border/50 py-5 text-center text-muted text-xs font-body">
          Built with MERN Stack + Claude AI &nbsp;·&nbsp; PathFinder © 2025
        </footer>
      </div>
    </div>
  );
}
