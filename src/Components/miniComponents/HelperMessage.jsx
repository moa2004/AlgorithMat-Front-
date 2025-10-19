import React from "react";
import { Link } from "react-router-dom";
import Buttons from "./Buttons";
import "./HelperMessage.css";

const variantMeta = {
  success: {
    color: "#10b981",
    bg: "#ecfdf5",
    icon: "✅",
    aria: "status",
  },
  error: {
    color: "#ef4444",
    bg: "#fef2f2",
    icon: "❌",
    aria: "alert",
  },
  warning: {
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: "⚠️",
    aria: "status",
  },
  info: {
    color: "#3b82f6",
    bg: "#eff6ff",
    icon: "ℹ️",
    aria: "status",
  },
  auth: {
    color: "#6366f1",
    bg: "#eef2ff",
    icon: "🔒",
    aria: "dialog",
  },
};

export default function HelperMessage({
  variant = "info",
  title,
  description,
  actions = [],
  icon,
  compact = false,
}) {
  const meta = variantMeta[variant] || variantMeta.info;

  return (
    <div
      className={`helper-message ${compact ? "helper-message--compact" : ""}`}
      role={meta.aria}
      aria-live={meta.aria === "alert" ? "assertive" : "polite"}
      aria-labelledby="helper-message-title"
      aria-describedby="helper-message-desc"
      style={{
        borderLeftColor: meta.color,
        backgroundColor: meta.bg,
      }}
    >
      <div
        className="helper-message__icon"
        aria-hidden
        style={{
          color: meta.color,
          background: `${meta.color}1a`, // 10% tint
        }}
      >
        <span>{icon || meta.icon}</span>
      </div>

      <div className="helper-message__body">
        {title && (
          <h4 id="helper-message-title" className="helper-message__title">
            {title}
          </h4>
        )}
        {description && (
          <div id="helper-message-desc" className="helper-message__desc">
            {description}
          </div>
        )}

        {actions?.length > 0 && (
          <div className="helper-message__actions">
            {actions.map((action, idx) => {
              const btn = (
                <Buttons
                  key={idx}
                  text={action.label}
                  onClick={action.onClick}
                  style={{ "--color-primer": meta.color, ...action.style }}
                />
              );

              if (action.type === "link" && action.to) {
                return (
                  <Link
                    key={idx}
                    to={action.to}
                    className="helper-message__linkwrap"
                  >
                    {btn}
                  </Link>
                );
              }
              return btn;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
