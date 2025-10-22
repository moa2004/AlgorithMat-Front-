import React from "react";
import Buttons from "../miniComponents/Buttons";

export default function DifficultySelector({ selected, onSelect }) {
  const levels = ["Easy", "Medium", "Hard"];

  const gradients = {
    easy: "linear-gradient(135deg, #22c55e, #10b981)",
    medium: "linear-gradient(135deg, #f97316, #f59e0b)",
    hard: "linear-gradient(135deg, #ef4444, #f97316)",
  };

  return (
    <section className="difficulty-section">
      <h2>Choose Difficulty</h2>
      <div className="difficulty-buttons">
        {levels.map((lvl) => {
          const key = lvl.toLowerCase();
          const isActive = selected === lvl;
          return (
            <Buttons
              text={lvl}
              key={lvl}
              onClick={() => onSelect(lvl)}
              className={`difficulty-pill ${key}${isActive ? " is-active" : ""}`}
              style={
                isActive
                  ? {
                      "--button-bg": gradients[key],
                      "--button-bg-hover": gradients[key],
                      "--button-border": "transparent",
                      "--button-border-hover": "transparent",
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}
