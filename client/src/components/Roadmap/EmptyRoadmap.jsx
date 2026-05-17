import { useNavigate } from "react-router-dom";

export default function EmptyRoadmap() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex items-center justify-center text-center px-4 py-24">
      <div className="fade-up max-w-sm">
        <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🗺️</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">No roadmap yet</h2>
        <p className="text-soft font-body text-sm leading-relaxed mb-8">
          Complete the onboarding chat so PathFinder AI can build your personalized career roadmap.
        </p>
        <button onClick={() => navigate("/onboarding")}
          className="bg-accent text-midnight font-display font-bold px-8 py-3.5 rounded-xl hover:bg-accent-dim transition-all hover:scale-105 duration-200">
          Start onboarding →
        </button>
      </div>
    </div>
  );
}
