import { useEffect, useRef } from "react";

export default function SkillChart({ skillHistory = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || skillHistory.length === 0) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 40 };

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(30,30,46,0.8)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ((H - pad.top - pad.bottom) / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = "#4b5563";
      ctx.font = "10px DM Sans";
      ctx.fillText(`${100 - i * 25}%`, 2, y + 4);
    }

    if (skillHistory.length < 2) {
      // Single dot
      const x = W / 2;
      const y = pad.top + (H - pad.top - pad.bottom) * (1 - skillHistory[0].level / 100);
      ctx.fillStyle = "#6ee7b7";
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      return;
    }

    const xStep = (W - pad.left - pad.right) / (skillHistory.length - 1);

    // Gradient fill under line
    const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
    grad.addColorStop(0, "rgba(110,231,183,0.3)");
    grad.addColorStop(1, "rgba(110,231,183,0)");

    ctx.beginPath();
    skillHistory.forEach((point, i) => {
      const x = pad.left + i * xStep;
      const y = pad.top + (H - pad.top - pad.bottom) * (1 - point.level / 100);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    // Close for fill
    const lastX = pad.left + (skillHistory.length - 1) * xStep;
    ctx.lineTo(lastX, H - pad.bottom);
    ctx.lineTo(pad.left, H - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#6ee7b7";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap  = "round";
    skillHistory.forEach((point, i) => {
      const x = pad.left + i * xStep;
      const y = pad.top + (H - pad.top - pad.bottom) * (1 - point.level / 100);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots + date labels
    skillHistory.forEach((point, i) => {
      const x = pad.left + i * xStep;
      const y = pad.top + (H - pad.top - pad.bottom) * (1 - point.level / 100);
      ctx.fillStyle = "#6ee7b7";
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#6ee7b7";
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();

      // Date label
      if (i === 0 || i === skillHistory.length - 1 || skillHistory.length <= 5) {
        ctx.fillStyle = "#4b5563";
        ctx.font = "9px DM Sans";
        const label = new Date(point.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        ctx.fillText(label, x - 12, H - pad.bottom + 14);
      }
    });
  }, [skillHistory]);

  if (skillHistory.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <p className="text-muted text-xs font-body uppercase tracking-widest mb-2">Skill Growth</p>
        <p className="text-soft text-sm font-body">Complete milestones to track your growth over time.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 fade-up-2">
      <p className="text-muted text-xs font-body uppercase tracking-widest mb-4">Skill Growth Over Time</p>
      <canvas ref={canvasRef} width={500} height={180} className="w-full h-auto" />
      <div className="flex justify-between mt-2">
        <span className="text-muted text-xs font-body">
          Started: {new Date(skillHistory[0]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="text-accent text-xs font-body font-medium">
          Current level: {skillHistory[skillHistory.length - 1]?.level}%
        </span>
      </div>
    </div>
  );
}
