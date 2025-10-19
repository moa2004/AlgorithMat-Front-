import React from "react";
import HelperMessage from "./HelperMessage";

/**
 * AuthRequiredMessage: unified auth prompt across the app
 * Props:
 * - compact?: boolean
 * - title?: string (override)
 * - description?: string (override)
 */
export default function AuthRequiredMessage({
  compact = false,
  title,
  description,
}) {
  return (
    <HelperMessage
      compact={compact}
      variant="auth"
      title={title || "Sign in required"}
      description={
        description || "To continue, please log in or create an account."
      }
      actions={[
        {
          type: "link",
          label: "Log in",
          to: "/LogIn",
          style: { "--color-primer": "#1e88e5" },
        },
        {
          type: "link",
          label: "Sign up",
          to: "/Register",
          style: { "--color-primer": "#10b981" },
        },
      ]}
    />
  );
}
