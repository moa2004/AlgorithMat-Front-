import React from "react";

/**
 * HelperText: small, subtle helper hint below inputs
 * Props:
 * - children: content to display (string or ReactNode)
 * - style: optional style override
 */
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
