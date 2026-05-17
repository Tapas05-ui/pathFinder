import { useNavigate } from "react-router-dom";

export default function CheckInBanner({ isDue, daysSince, lastCheckIn }) {
  const navigate = useNavigate();

  if (!isDue) return (
    <div className="bg-surface border border-border rounded-2xl px-5 py-3 flex items-center justify-between fade-in">
      <div className="flex items-center gap-2">
        <span className="text-accent text-sm">✅</span>
        <p className="text-soft text-xs font-body">
          Weekly check-in done · Next check-in in {7 - (daysSince || 0)} days
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-2xl px-5 py-4 flex items-center justify-between fade-in">
      <div>
        <p className="text-accent text-sm font-display font-semibold">
          {lastCheckIn ? "Weekly check-in due! 🔔" : "Start your first check-in! 🚀"}
        </p>
        <p className="text-soft text-xs font-body mt-0.5">
          {lastCheckIn
            ? `Last check-in was ${daysSince} day${daysSince !== 1 ? "s" : ""} ago`
            : "Let PathFinder AI review your progress and give you guidance"}
        </p>
      </div>
      <button onClick={() => navigate("/checkin")}
        className="flex-shrink-0 bg-accent text-midnight font-display font-bold text-xs px-4 py-2 rounded-xl
          hover:bg-accent-dim transition-all hover:scale-105 duration-200 ml-4">
        Check in →
      </button>
    </div>
  );
}
