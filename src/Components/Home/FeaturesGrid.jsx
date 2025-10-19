import React from "react";
import { Link } from "react-router-dom";

export default function FeaturesGrid() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1000, padding: "0 10px" }}>
        <div style={{ textAlign: "center", margin: "10px 0 18px" }}>
          <h2 style={{ margin: 0, color: "#111", fontWeight: 800 }}>
            Build. Solve. Grow.
          </h2>
          <p style={{ margin: "6px 0 0", color: "#4b5563", fontWeight: 600 }}>
            Practice challenges, add your own problems, and test code instantly
            — all in one place.
          </p>
        </div>

        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {/* Solve Problems */}
          <div
            className="feature-card"
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <i className="fa-solid fa-bolt" style={{ color: "#f59e0b" }}></i>
              <h3 style={{ margin: 0, color: "#024e96" }}>Solve Problems</h3>
            </div>
            <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
              Sharpen your skills with curated challenges and real-world tasks.
            </p>
            <Link to="/ProblemList/problemListPge">
              <button className="welcome-btn" style={{ fontWeight: 700 }}>
                Explore Problem List
              </button>
            </Link>
          </div>

          {/* Add Problems */}
          <div
            className="feature-card"
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <i className="fa-solid fa-plus" style={{ color: "#22c55e" }}></i>
              <h3 style={{ margin: 0, color: "#024e96" }}>Add Your Problems</h3>
            </div>
            <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
              Contribute to the community by creating challenges that inspire
              others.
            </p>
            <Link to="/AddProblem">
              <button
                className="welcome-btn welcome-btn--green"
                style={{ fontWeight: 700 }}
              >
                Create a Problem
              </button>
            </Link>
          </div>

          {/* Test Your Code */}
          <div
            className="feature-card"
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <i className="fa-solid fa-code" style={{ color: "#6366f1" }}></i>
              <h3 style={{ margin: 0, color: "#024e96" }}>Test Your Code</h3>
            </div>
            <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
              Validate logic instantly with our sandbox — quick, safe, and
              powerful.
            </p>
            <Link to="/ProblemList/testYourCode">
              <button className="welcome-btn" style={{ fontWeight: 700 }}>
                Try the Playground
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
