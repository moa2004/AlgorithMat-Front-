import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import "./ProblemPage.css";
import DifficultyButtons from "../../../Components/Problem Components/DifficultyButtons";
import Buttons from "../../../Components/miniComponents/Buttons";
import TestCaseTable from "../../../Components/Problem Components/TestCaseTable";
import LoadingSpinner from "../../../Components/miniComponents/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      try {
        const t = document.createElement("textarea");
        t.value = shareUrl;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
      } catch (err) {
        console.log(err);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Solution reveal/copy state
  const [showSolution, setShowSolution] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const handleCopySolution = async () => {
    if (!problem?.solutionCode || !showSolution) return;
    try {
      await navigator.clipboard.writeText(problem.solutionCode);
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 1500);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch(`http://localhost:5023/api/v1/problems/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProblem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching problem:", err);
        setLoading(false);
      });
  }, [id]);

  //loding + Problem not found.
  if (loading) return <LoadingSpinner />;
  if (!problem) return <div className="error">Problem not found.</div>;

  //Buttons

  console.log(problem);
  return (
    <div className="problem-page">
      {/* العمود الرئيسي (70%) */}
      <div className="problem-content">
        <h2>
          {problem.title} #{problem.problemID}
        </h2>
        {problem.timeLimitMilliseconds != null && (
          <p>
            <strong>Time Limit:</strong> {problem.timeLimitMilliseconds} ms
          </p>
        )}
        <p>
          <strong>Created By:</strong> {problem.createdByUsername}
        </p>

        <div className="section">
          <h3>Description</h3>
          <p>{problem.generalDescription}</p>
        </div>

        <div className="section">
          <h3>Input</h3>
          <p>{problem.inputDescription}</p>
        </div>

        <div className="section">
          <h3>Output</h3>
          <p>{problem.outputDescription}</p>
        </div>

        <div className="section">
          <h3>Tags</h3>
          <div className="tags">
            {problem.tags?.map((tag) => (
              <span key={tag.tagID} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Difficulty</h3>
          <DifficultyButtons
            text={problem.difficulty}
            style={{
              marginTop: "10px",
              textAlign: "center",
              "--color-primer":
                problem.difficulty === "Easy"
                  ? "#3eda5dff"
                  : problem.difficulty === "Hard"
                  ? "tomato"
                  : "#f5a623",
              width: "100px",
              fontSize: "14px",
            }}
          />
        </div>

        <div className="section">
          <h3>Sample Test Cases</h3>
          <TestCaseTable testCases={problem.sampleTestCases} />
        </div>

        {/* <div className="section">
          <h3>Note</h3>
          <p>{problem.note}</p>
        </div> */}
      </div>

      {/* عمود الـ tutorial (30%) */}
      <div>
        <div className="tutorial-section">
          <h3>Tutorial</h3>
          {problem.tutorial ? (
            <p>{problem.tutorial}</p>
          ) : (
            <p className="no-tutorial">
              No tutorial available for this problem.
            </p>
          )}

          {/* Solution reveal inside Tutorial section */}
          <div className="solution-card">
            <div className="solution-header">
              <h4 style={{ margin: 0 }}>Solution</h4>
              <button
                className="reveal-btn"
                onClick={() => setShowSolution((v) => !v)}
                disabled={!problem?.solutionCode}
                title={showSolution ? "Hide solution" : "Show solution"}
              >
                {showSolution ? (
                  // eye-off
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42" />
                    <path d="M16.88 16.88A10.05 10.05 0 0112 19c-4.48 0-8.27-2.94-9.54-7a10.05 10.05 0 012.04-3.37M6.23 6.23A10 10 0 0112 5c4.48 0 8.27 2.94 9.54 7a10.06 10.06 0 01-4.13 5.09" />
                  </svg>
                ) : (
                  // eye
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
                <span style={{ marginLeft: 6 }}>
                  {showSolution ? "Hide" : "Show"}
                </span>
              </button>
            </div>

            {!problem?.solutionCode && (
              <p className="no-tutorial" style={{ marginTop: 8 }}>
                No solution code available.
              </p>
            )}

            {showSolution && problem?.solutionCode && (
              <div className="code-container">
                <div className="solution-toolbar">
                  <span className="badge">Solution Code</span>
                  <button
                    className="btn-outline"
                    onClick={handleCopySolution}
                    title="Copy solution code"
                  >
                    {copiedSolution ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{problem.solutionCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
        <div className="tutorial-section" style={{ marginTop: "20px" }}>
          <h3>Notes</h3>
          {problem.note ? (
            <p>{problem.note}</p>
          ) : (
            <p className="no-tutorial">No Notes available for this problem.</p>
          )}
        </div>
        <div className="tutorial-section " style={{ marginTop: "20px" }}>
          <div className="flex">
            {/* <label>
              <span style={{ fontWeight: "600", marginRight: "10px" }}>
                Go back to Problim List
              </span> */}
            <Buttons
              text="Problem List"
              style={{ marginRight: "20px", width: "30%", textAlign: "center" }}
              onClick={() => {
                navigate(`/ProblemList/problemListPge`);
              }}
            />
            {/* </label>
            <label> */}
            {/* <span style={{ fontWeight: "600", marginRight: "10px" }}>
                Submit your solution
              </span> */}
            <Buttons
              text="Submision"
              style={{ marginRight: "20px", width: "30%", textAlign: "center" }}
              onClick={() => {
                navigate(`/ProblemList/Submision/${id}`);
              }}
            />
            {/* </label>
            <label> */}
            {/* <span style={{ fontWeight: "600", marginRight: "10px" }}>
                Test your code  
              </span> */}
            <Buttons
              text="Test code"
              style={{ width: "30%", textAlign: "center" }}
              onClick={() => {
                navigate(`/ProblemList/testYourCode`);
              }}
            />
            {/* </label> */}
          </div>

          {/* Share this challenge (under the buttons) */}
        </div>
        <div className="tutorial-section" style={{ marginTop: "20px" }}>
          <div
            className="tutorial-section"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 14,
              width: "100%",
            }}
          >
            <div
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: "#111" }}>
                  Share this challenge
                </h3>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#4b5563",
                    fontWeight: 600,
                    width: "100%",
                  }}
                >
                  Inspire your friends: copy and share this problem link.
                </p>
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: "monospace",
                fontSize: 13,
                color: "#374151",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {shareUrl}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleCopyLink}
                className="welcome-btn"
                style={{ fontWeight: 700, minWidth: 120, marginTop: "10px" }}
                title="Copy problem link"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
