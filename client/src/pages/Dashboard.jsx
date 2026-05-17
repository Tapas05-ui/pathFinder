import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar          from "../components/Dashboard/Navbar";
import ProgressCard    from "../components/Dashboard/ProgressCard";
import CareerPathTabs  from "../components/Dashboard/CareerPathTabs";
import SkillChart      from "../components/Dashboard/SkillChart";
import CheckInBanner   from "../components/Dashboard/CheckInBanner";
import MilestoneCard   from "../components/Roadmap/MilestoneCard";
import WhyItFitsYou    from "../components/Roadmap/WhyItFitsYou";
import EmptyRoadmap    from "../components/Roadmap/EmptyRoadmap";

export default function Dashboard() {
  const [roadmap,       setRoadmap]       = useState(null);
  const [checkinStatus, setCheckinStatus] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState(0);

  useEffect(() => {
    Promise.all([fetchRoadmap(), fetchCheckinStatus()]).finally(() => setLoading(false));
  }, []);

  const fetchRoadmap = async () => {
    try {
      const { data } = await api.get("/roadmap");
      setRoadmap(data);
      setActiveTab(data.activePathIndex || 0);
    } catch { /* 404 = no roadmap yet */ }
  };

  const fetchCheckinStatus = async () => {
    try {
      const { data } = await api.get("/checkin/status");
      setCheckinStatus(data);
    } catch { /* ignore */ }
  };

  const handleTabSwitch = async (index) => {
    if (index === activeTab) return;
    setActiveTab(index);
    try {
      const { data } = await api.patch("/roadmap/active-path", { pathIndex: index });
      setRoadmap(data);
    } catch (err) { console.error(err); }
  };

  const updateMilestoneLocally = (pathIndex, milestoneIndex, completed) => {
    setRoadmap((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const m = updated.careerPaths[pathIndex].milestones[milestoneIndex];
      m.completed   = completed;
      m.completedAt = completed ? new Date().toISOString() : null;
      const path = updated.careerPaths[pathIndex];
      const done = path.milestones.filter((x) => x.completed).length;
      updated.overallProgress = Math.round((done / path.milestones.length) * 100);
      return updated;
    });
  };

  const completeMilestone = async (pathIndex, milestoneIndex) => {
    updateMilestoneLocally(pathIndex, milestoneIndex, true);
    try {
      const { data } = await api.patch(`/roadmap/milestone/${pathIndex}/${milestoneIndex}/complete`);
      setRoadmap(data);
      fetchCheckinStatus(); // refresh skill history
    } catch { fetchRoadmap(); }
  };

  const undoMilestone = async (pathIndex, milestoneIndex) => {
    updateMilestoneLocally(pathIndex, milestoneIndex, false);
    try {
      const { data } = await api.patch(`/roadmap/milestone/${pathIndex}/${milestoneIndex}/undo`);
      setRoadmap(data);
    } catch { fetchRoadmap(); }
  };

  if (loading) return (
    <div className="min-h-screen bg-midnight flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-soft text-sm font-body">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!roadmap) return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <Navbar />
      <EmptyRoadmap />
    </div>
  );

  const activePath     = roadmap.careerPaths[activeTab];
  const completedCount = activePath?.milestones.filter((m) => m.completed).length || 0;
  const totalCount     = activePath?.milestones.length || 0;

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Check-in banner */}
        {checkinStatus && (
          <CheckInBanner
            isDue={checkinStatus.isDue}
            daysSince={checkinStatus.daysSince}
            lastCheckIn={checkinStatus.lastCheckIn}
          />
        )}

        {/* Progress */}
        <ProgressCard careerTitle={activePath?.title || "Your Career Path"} completed={completedCount} total={totalCount} />

        {/* Skill growth chart */}
        {checkinStatus?.skillHistory?.length > 0 && (
          <SkillChart skillHistory={checkinStatus.skillHistory} />
        )}

        {/* Career path tabs */}
        <CareerPathTabs paths={roadmap.careerPaths} activeTab={activeTab} onSelect={handleTabSwitch} />

        {/* Why it fits */}
        <WhyItFitsYou text={activePath?.whyItFitsYou} />

        {/* Milestones */}
        {activePath && (
          <div className="fade-up-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display font-bold text-lg text-white">Your Roadmap</h3>
              <span className="text-muted text-xs font-body">Click ✓ to complete · Click again to undo</span>
            </div>
            {activePath.milestones.map((milestone, mi) => (
              <MilestoneCard key={`${activeTab}-${mi}`} milestone={milestone} index={mi} pathIndex={activeTab}
                onComplete={completeMilestone} onUndo={undoMilestone} />
            ))}
          </div>
        )}

        {completedCount === totalCount && totalCount > 0 && (
          <div className="fade-in bg-gradient-to-r from-accent/10 to-emerald-500/10 border border-accent/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">Path Complete!</h3>
            <p className="text-soft text-sm font-body max-w-xs mx-auto">You've finished all milestones. Incredible work!</p>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
