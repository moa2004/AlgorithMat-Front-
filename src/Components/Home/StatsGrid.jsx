import React from "react";
import ProfileCard from "../Profile Componennts/ProfileCard";

export default function StatsGrid({ stats, loading }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="stats-grid" style={{ gap: "16px" }}>
        <ProfileCard
          text="Number of All Problems"
          num={stats?.numberOfProblems ?? (loading ? "…" : 0)}
        />
        <ProfileCard
          text="Number of All Submissions"
          num={stats?.numberOfSubmissions ?? (loading ? "…" : 0)}
        />
        <ProfileCard
          text="Number of Active users"
          num={stats?.numberOfActiveUsers ?? (loading ? "…" : 0)}
        />
      </div>
    </div>
  );
}
