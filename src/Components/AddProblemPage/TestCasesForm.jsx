import { useState } from "react";
import Buttons from "../miniComponents/Buttons";
import HelperText from "../miniComponents/HelperText";

export default function TestCasesForm({ testCases, onChange }) {
  const [input, setInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSample, setIsSample] = useState(false);

  const addCase = () => {
    if (!input.trim()) return;
    const newCases = [
      ...testCases,
      { input: input.trim(), isPublic, isSample },
    ];
    onChange(newCases);
    setInput("");
    setIsPublic(true);
    setIsSample(false);
  };

  const removeCase = (index) => {
    const newCases = testCases.filter((_, i) => i !== index);
    onChange(newCases);
  };

  return (
    <div className="test-cases-container">
      <h2>Test Cases</h2>

      {/* إدخال البيانات */}
      <div className="test-case-form">
        <input
          placeholder="Enter test case inputs.."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <HelperText>
          Enter the exact input as the program should read it. You can add
          multiple cases.
        </HelperText>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public
          </label>
          <label>
            <input
              type="checkbox"
              checked={isSample}
              onChange={(e) => setIsSample(e.target.checked)}
            />
            Sample
          </label>
        </div>

        <Buttons
          text="➕ Add Case"
          onClick={addCase}
          style={{ marginTop: "10px" }}
        />
      </div>

      {/* test cases */}
      <ul className="test-case-list">
        {testCases.length === 0 && (
          <p style={{ color: "#666" }}>No test cases added yet</p>
        )}
        {testCases.map((tc, index) => (
          <li key={index} className="test-case-item">
            <div className="test-case-info">
              <span className="case-input">{tc.input}</span>
              <span className="case-flags">
                {tc.isPublic ? "🌍 Public" : "🔒 Private"} |{" "}
                {tc.isSample ? "📘 Sample" : "📄 Normal"}
              </span>
            </div>
            <button className="remove-btn" onClick={() => removeCase(index)}>
              ❌ Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
