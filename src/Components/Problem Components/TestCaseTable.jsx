import React from "react";
import "./TestCaseTable.css";

export default function TestCaseTable({ testCases }) {
  if (!testCases || testCases.length === 0) {
    return <p style={{ color: "#888" }}>No sample test cases available.</p>;
  }

  return (
    <div className="testcase-table">
      {testCases.map((tc, index) => (
        <div key={index} className="testcase-block">
          <div className="testcase-row">
            <span className="label">input</span>
            <pre className="value">{tc.input}</pre>
          </div>
          <div className="testcase-row">
            <span className="label">output</span>
            <pre className="value">{tc.output}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}
