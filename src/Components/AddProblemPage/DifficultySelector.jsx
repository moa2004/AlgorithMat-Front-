import React from "react";
import Buttons from "../miniComponents/Buttons";

export default function DifficultySelector({ selected, onSelect }) {
  const levels = ["Easy", "Medium", "Hard"];

  return (
    <div>
      <h2>Choose Difficulty</h2>
      {levels.map((lvl) => (
        // <button className=".menu-toggle"
        //   key={lvl}
        //   onClick={() => onSelect(lvl)}
        //   style={{
        //     margin: "5px",
        //     backgroundColor: selected === lvl ? "green" : "lightgray"
        //   }}
        // >
        //   {lvl}
        // </button>

        <Buttons
          text={lvl}
          key={lvl}
          onClick={() => onSelect(lvl)}
          style={{
            margin: "5px",

           
            "--color-primer":
              selected === lvl
                ? lvl === "Easy"
                  ? "#3eda5dff"
                  : lvl === "Medium"
                  ? "#f5a623"
                  : "tomato"
                : "lightgray",
          }}
        />
      ))}
    </div>
  );
}
