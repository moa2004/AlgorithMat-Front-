import React, { useEffect, useState } from "react";
import HelperMessage from "../miniComponents/HelperMessage";

export default function ProblemInfoForm({ problemData, onChange }) {
  const [compilers, setCompilers] = useState([]);
  const [loadingCompilers, setLoadingCompilers] = useState(false);
  const [compilersError, setCompilersError] = useState(null);

  const [hints, setHints] = useState({
    title: false,
    compiler: false,
    generalDescription: false,
    inputDescription: false,
    outputDescription: false,
    note: false,
    solutionCode: false,
    tutorial: false,
    timeLimitMilliseconds: false,
  });
  const toggleHint = (key) =>
    setHints((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const fetchCompilers = async () => {
      try {
        setLoadingCompilers(true);
        setCompilersError(null);
        const res = await fetch(
          "http://localhost:5023/api/v1/compilers"
        );
        if (!res.ok) throw new Error("Failed to fetch compilers");
        const data = await res.json();
        setCompilers(Array.isArray(data) ? data : []);
        if (!problemData.compilerName && data?.length) {
          onChange("compilerName", data[0].compilerName);
        }
      } catch (e) {
        console.error(e);
        setCompilersError("Compilers not fetched ❌");
      } finally {
        setLoadingCompilers(false);
      }
    };
    fetchCompilers();
  }, []);

  const hintBtn = (key, label) => (
    <button
      type="button"
      onClick={() => toggleHint(key)}
      aria-label={`Show help: ${label}`}
      title="Help"
      style={{
        marginLeft: 8,
        border: "1px solid #e5e7eb",
        background: "#f8fafc",
        color: "#0f172a",
        borderRadius: "50%",
        width: 28,
        height: 28,
        fontSize: 16,
        lineHeight: "28px",
        cursor: "pointer",
      }}
    >
      ?
    </button>
  );

  return (
    <div>
      <h2 style={{ marginBottom: "15px" }}>Problem Information</h2>

      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          placeholder="Title.."
          value={problemData.title}
          onChange={(e) => onChange("title", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("title", "Title")}
      </div>
      {hints.title && (
        <HelperMessage
          compact
          variant="info"
          title="Title"
          description="Choose a clear, concise title (e.g., Sum of Two Numbers)."
        />
      )}

      {/* Compiler selector from API */}
      <div style={{ margin: "8px 0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ fontWeight: 600, marginBottom: 6 }}>Compiler</label>
          {hintBtn("compiler", "Compiler")}
        </div>
        {loadingCompilers ? (
          <p style={{ color: "#007bff" }}>Loading compilers... ⏳</p>
        ) : compilersError ? (
          <p style={{ color: "red" }}>{compilersError}</p>
        ) : (
          <select
            value={problemData.compilerName}
            onChange={(e) => onChange("compilerName", e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
            }}
          >
            {compilers.map((c) => (
              <option key={c.compilerName} value={c.compilerName}>
                {c.name} ({c.language})
              </option>
            ))}
          </select>
        )}
        {hints.compiler && (
          <HelperMessage
            compact
            variant="info"
            title="Compiler"
            description="Pick the appropriate language/compiler for your reference solution."
          />
        )}
      </div>

      {/* General Description */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <textarea
          placeholder="General Description.."
          value={problemData.generalDescription}
          onChange={(e) => onChange("generalDescription", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("generalDescription", "General description")}
      </div>
      {hints.generalDescription && (
        <HelperMessage
          compact
          variant="info"
          title="General Description"
          description="Briefly describe the problem goal and what the solution must do."
        />
      )}

      {/* Input Description */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <textarea
          placeholder="Input Description"
          value={problemData.inputDescription}
          onChange={(e) => onChange("inputDescription", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("inputDescription", "Input description")}
      </div>
      {hints.inputDescription && (
        <HelperMessage
          compact
          variant="info"
          title="Input Description"
          description="Specify the input format and constraints (e.g., one line with two space‑separated integers)."
        />
      )}

      {/* Output Description */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <textarea
          placeholder="Output Description.."
          value={problemData.outputDescription}
          onChange={(e) => onChange("outputDescription", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("outputDescription", "Output description")}
      </div>
      {hints.outputDescription && (
        <HelperMessage
          compact
          variant="info"
          title="Output Description"
          description="Describe the exact output format (spacing, casing, and line breaks matter)."
        />
      )}

      {/* Note */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <textarea
          placeholder="note.."
          value={problemData.note}
          onChange={(e) => onChange("note", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("note", "Notes")}
      </div>
      {hints.note && (
        <HelperMessage
          compact
          variant="info"
          title="Notes"
          description="Add any extra notes that help clarify edge cases (optional)."
        />
      )}

      {/* Solution Code */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <textarea
          placeholder="(Solution Code)"
          value={problemData.solutionCode}
          onChange={(e) => onChange("solutionCode", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("solutionCode", "Solution code")}
      </div>
      {hints.solutionCode && (
        <HelperMessage
          compact
          variant="info"
          title="Solution Code"
          description="Provide a reference solution if available (won’t be shown to users)."
        />
      )}

      {/* Tutorial */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="text"
          placeholder="Tutorial (text or URL)"
          value={problemData.tutorial}
          onChange={(e) => onChange("tutorial", e.target.value)}
          style={{ flex: 1 }}
        />
        {hintBtn("tutorial", "Tutorial")}
      </div>
      {hints.tutorial && (
        <HelperMessage
          compact
          variant="info"
          title="Tutorial"
          description="Add a short explanation or a helpful URL for learners (optional)."
        />
      )}

      {/* Time Limit */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          placeholder="Time Limit (ms)"
          value={problemData.timeLimitMilliseconds}
          onChange={(e) =>
            onChange("timeLimitMilliseconds", parseInt(e.target.value))
          }
          style={{ flex: 1 }}
        />
        {hintBtn("timeLimitMilliseconds", "Max time")}
      </div>
      {hints.timeLimitMilliseconds && (
        <HelperMessage
          compact
          variant="info"
          title="Time Limit"
          description="Maximum execution time in milliseconds (e.g., 500 = half a second)."
        />
      )}
    </div>
  );
}
