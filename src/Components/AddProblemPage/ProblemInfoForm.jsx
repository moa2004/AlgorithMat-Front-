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
        const res = await fetch("http://localhost:5023/api/v1/compilers");
        if (!res.ok) throw new Error("Failed to fetch compilers");
        const data = await res.json();
        setCompilers(Array.isArray(data) ? data : []);
        if (!problemData.compilerName && data?.length) {
          onChange("compilerName", data[0].compilerName);
        }
      } catch (e) {
        console.error(e);
        setCompilersError("Compilers not fetched.");
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
      className="hint-button"
      aria-label={`Show help: ${label}`}
      title="Help"
    >
      ?
    </button>
  );

  return (
    <section className="problem-info-section">
      <h2>Problem Information</h2>

      <div className="field-row">
        <input
          placeholder="Title..."
          value={problemData.title}
          onChange={(e) => onChange("title", e.target.value)}
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

      <div className="field-block">
        <div className="field-label">
          <label>Compiler</label>
          {hintBtn("compiler", "Compiler")}
        </div>
        {loadingCompilers ? (
          <p className="field-status field-status--info">
            Loading compilers...
          </p>
        ) : compilersError ? (
          <p className="field-status field-status--error">{compilersError}</p>
        ) : (
          <select
            value={problemData.compilerName}
            onChange={(e) => onChange("compilerName", e.target.value)}
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

      <div className="field-row">
        <textarea
          placeholder="General description..."
          value={problemData.generalDescription}
          onChange={(e) => onChange("generalDescription", e.target.value)}
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

      <div className="field-row">
        <textarea
          placeholder="Input description..."
          value={problemData.inputDescription}
          onChange={(e) => onChange("inputDescription", e.target.value)}
        />
        {hintBtn("inputDescription", "Input description")}
      </div>
      {hints.inputDescription && (
        <HelperMessage
          compact
          variant="info"
          title="Input Description"
          description="Specify the input format and constraints (e.g., one line with two space-separated integers)."
        />
      )}

      <div className="field-row">
        <textarea
          placeholder="Output description..."
          value={problemData.outputDescription}
          onChange={(e) => onChange("outputDescription", e.target.value)}
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

      <div className="field-row">
        <textarea
          placeholder="Notes (optional)..."
          value={problemData.note}
          onChange={(e) => onChange("note", e.target.value)}
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

      <div className="field-row">
        <textarea
          placeholder="Solution code..."
          value={problemData.solutionCode}
          onChange={(e) => onChange("solutionCode", e.target.value)}
        />
        {hintBtn("solutionCode", "Solution code")}
      </div>
      {hints.solutionCode && (
        <HelperMessage
          compact
          variant="info"
          title="Solution Code"
          description="Provide a reference solution if available (will not be shown to users)."
        />
      )}

      <div className="field-row">
        <input
          type="text"
          placeholder="Tutorial (text or URL)"
          value={problemData.tutorial}
          onChange={(e) => onChange("tutorial", e.target.value)}
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

      <div className="field-row">
        <input
          type="number"
          placeholder="Time limit (ms)"
          value={problemData.timeLimitMilliseconds}
          onChange={(e) =>
            onChange("timeLimitMilliseconds", parseInt(e.target.value, 10))
          }
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
    </section>
  );
}
