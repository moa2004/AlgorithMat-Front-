import React from "react";
import { Link } from "react-router-dom";
import DifficultyButtons from "../Problem Components/DifficultyButtons";
import LoadingSpinner from "../miniComponents/LoadingSpinner";

export default function MostSolvedList({
  latestProblems,
  loading,
  error,
  onOpen,
}) {
  const truncate = (text, max = 100) =>
    typeof text === "string" && text.length > max
      ? text.slice(0, max) + "…"
      : text || "";

  return (
    <div className="list-card">
      <div className="list-header">
        <h3 className="list-title">Most Solved Problems</h3>
        <Link to="/ProblemList/problemListPge" style={{ fontWeight: 700 }}>
          View all
        </Link>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 10 }}>
          <LoadingSpinner />
        </div>
      )}

      {error && <div style={{ color: "tomato", padding: 10 }}>⚠️ {error}</div>}

      {!loading && !error && latestProblems.length === 0 && (
        <div style={{ color: "#666", padding: 10 }}>No problems yet</div>
      )}

      <div style={{ display: "grid", rowGap: 8 }}>
        {latestProblems.map((p) => (
          <div
            key={p.problemID}
            onClick={() => onOpen?.(p.problemID)}
            className="list-item"
            title="Open problem page"
          >
            <div className="item-header">
              <div style={{ fontWeight: 700, color: "#111" }}>
                #{p.problemID} • {p.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DifficultyButtons
                  text={p.difficulty}
                  style={{
                    "--color-primer":
                      p.difficulty === "Easy"
                        ? "#3eda5dff"
                        : p.difficulty === "Hard"
                        ? "tomato"
                        : "#f5a623",
                    fontSize: "12.5px",
                  }}
                />
                <span
                  title="Attempts"
                  style={{
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 12,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Attempts: {p.attemptsCount ?? 0}
                </span>
              </div>
            </div>
            {p.generalDescription && (
              <div className="item-meta">{truncate(p.generalDescription)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
