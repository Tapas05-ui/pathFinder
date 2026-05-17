import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Roadmap" },
    { to: "/checkin",   label: "Check-in" },
  ];

  return (
    <nav className="border-b border-border/60 px-6 py-4 flex items-center justify-between bg-midnight/80 backdrop-blur-sm sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-midnight font-display font-black text-xs">P</span>
        </div>
        <span className="font-display font-bold text-lg text-white">Path<span className="text-accent">Finder</span></span>
      </Link>

      <div className="flex items-center gap-2">
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to}
            className={`px-4 py-1.5 rounded-lg text-sm font-body transition-colors
              ${pathname === to ? "bg-accent/10 text-accent border border-accent/20" : "text-soft hover:text-white hover:bg-card"}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5">
          <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-accent text-xs font-display font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <span className="text-soft text-sm font-body">{user?.name?.split(" ")[0]}</span>
        </div>
        <button onClick={logout}
          className="text-muted hover:text-white text-sm font-body transition-colors px-3 py-1.5 rounded-lg hover:bg-card">
          Sign out
        </button>
      </div>
    </nav>
  );
}
