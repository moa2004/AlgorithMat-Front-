import React from "react";

export default function HelperText({ children, style }) {
  return (
    <p
      style={{
        color: "#6b7280",
        fontSize: 12,
        marginTop: 0,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
