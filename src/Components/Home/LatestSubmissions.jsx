import React from "react";
import { Link } from "react-router-dom";
import DifficultyButtons from "../Problem Components/DifficultyButtons";
import LoadingSpinner from "../miniComponents/LoadingSpinner";

export default function LatestSubmissions({
  latestSubs,
  loading,
  error,
  onOpen,
}) {
  return (
    <div className="list-card">
      <div className="list-header">
        <h3 className="list-title">Latest Submissions</h3>
        <Link to="/Submisions" style={{ fontWeight: 700 }}>
          View all
        </Link>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 10 }}>
          <LoadingSpinner />
        </div>
      )}

      {error && <div style={{ color: "tomato", padding: 10 }}>⚠️ {error}</div>}

      {!loading && !error && latestSubs.length === 0 && (
        <div style={{ color: "#666", padding: 10 }}>No submissions yet</div>
      )}

      <div style={{ display: "grid", rowGap: 8 }}>
        {latestSubs.map((s) => (
          <div
            key={s.submissionID}
            onClick={() => onOpen?.(s.submissionID)}
            className="list-item"
            title="Open submission details"
          >
            <div className="item-header">
              <div style={{ fontWeight: 700, color: "#111" }}>
                #{s.submissionID} • {s.problemTitle}
              </div>
              <DifficultyButtons
                text={s.status}
                style={{
                  "--color-primer":
                    s.status === "Accepted" ? "#3eda5dff" : "tomato",
                  fontSize: "12.5px",
                }}
              />
            </div>
            <div className="item-meta">
              {s.username} • {new Date(s.submittedAt).toLocaleString()}
            </div>
            {s.compilerName && (
              <div className="item-submeta">Compiler: {s.compilerName}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
