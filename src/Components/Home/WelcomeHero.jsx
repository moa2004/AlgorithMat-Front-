import React from "react";

// Simple hero card: shows different content based on username
export default function WelcomeHero({ username }) {
  return (
    <>
      {username ? (
        <div className="welcome-card">
          <div className="welcome-card__bar" />
          <h2 className="welcome-title">
            Welcome back, {username}
            <i
              className="fa-regular fa-face-smile"
              style={{ marginLeft: 8 }}
              aria-hidden="true"
            ></i>
          </h2>
          <p
            className="welcome-subtitle"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            Great to see you again! Start solving a new problem or review the
            latest solutions.
          </p>
        </div>
      ) : (
        <div className="welcome-card">
          <div className="welcome-card__bar" />
          <h2 className="welcome-title">
            Welcome to AlgorithMat{" "}
            <i
              className="fa-regular fa-hand-peace"
              style={{ marginLeft: 8, color: "#f59e0b" }}
              aria-hidden="true"
            ></i>
          </h2>
          <p
            className="welcome-subtitle"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            Get started today! Sign up and begin your journey solving problems
            and improving your skills.
          </p>
        </div>
      )}
    </>
  );
}
