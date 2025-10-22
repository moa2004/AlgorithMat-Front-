import React from "react";
import "./Buttons.css";

export default function Buttons({ text, onClick, style, className }) {
  const classes = className ? `Button ${className}` : "Button";

  return (
    <div className={classes} onClick={onClick} style={style}>
      {text}
    </div>
  );
}
