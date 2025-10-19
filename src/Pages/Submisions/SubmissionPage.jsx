import React, { useEffect, useState } from "react";
import "./SubmissionPage.css";
import Buttons from "../../Components/miniComponents/Buttons";
import axios from "axios";
import Modal from "../../Components/Modal";
import { useParams } from "react-router-dom";
import AuthRequiredMessage from "../../Components/miniComponents/AuthRequiredMessage";
import DifficultyButtons from "../../Components/Problem Components/DifficultyButtons";

const StatusChip = ({ status }) => {
  const color =
    status === "Accepted"
      ? "#3eda5d"
      : status?.toLowerCase?.().includes("pending")
      ? "#f0ad4e"
      : "tomato";

  return (
    <span
      style={{
        backgroundColor: color,
        color: "#fff",
        padding: "4px 10px",
        borderRadius: "16px",
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      {status}
    </span>
  );
};

export default function SubmissionPage() {
  const { id } = useParams();

  // Form state
  const [code, setCode] = useState("");
  const [problemID, setProblemID] = useState(id || "");
  const [compilerName, setCompilerName] = useState("");
  const [compilers, setCompilers] = useState([]);
  const [visionScope, setVisionScope] = useState("onlyme");

  // UI state
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [message, setMessage] = useState("");
  const [accept, setAccept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Submission/result state
  const [submissionID, setSubmissionID] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [errorRes, setErrorRes] = useState(null);

  // Token parsing (safe)
  const rawAuth = localStorage.getItem("userAuth");
  let token = null;
  try {
    token = rawAuth ? JSON.parse(rawAuth)?.userData?.token ?? null : null;
  } catch (e) {
    console.log(e);
    token = null;
  }

  // Get Compilers (axios, with cancellation guard)
  useEffect(() => {
    let canceled = false;
    axios
      .get("http://localhost:5023/api/v1/compilers")
      .then((res) => {
        if (!canceled) setCompilers(res.data || []);
      })
      .catch((err) => console.error("Error fetching compilers:", err));

    return () => {
      canceled = true;
    };
  }, []);

  // Unified Auth modal content
  const Auth = <AuthRequiredMessage />;

  // Validate inputs
  const validate = () => {
    const e = {};
    if (!problemID) e.problemID = "You must specify the Problem ID";
    if (!compilerName) e.compilerName = "Choose a compiler";
    if (!code?.trim()) e.code = "Code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    setAccept(true);

    if (!token) {
      setMessage(Auth);
      setIsPopupActive(true);
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        problemID: Number(problemID),
        compilerName,
        code,
        visionScope,
      };

      const res = await axios.post(
        "http://localhost:5023/api/v1/submissions/submit",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setSubmissionID(res.data);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch result for submission (guarded + cancellation)
  useEffect(() => {
    if (!submissionID || !token) return;
    let canceled = false;

    axios
      .get(
        `http://localhost:5023/api/v1/submissions/${submissionID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (!res.ok && (res.status < 200 || res.status >= 300)) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.data;
      })
      .then((data) => {
        if (!canceled) {
          setSubmissionData(data);
          setErrorRes(null);
          console.log("Submission Result:", data);
        }
      })
      .catch((err) => {
        if (!canceled) {
          console.error("Error fetching submission:", err);
          setErrorRes(err.message);
        }
      });

    return () => {
      canceled = true;
    };
  }, [submissionID, token]);

  // حساب عدد الأسطر لعمود أرقام الأسطر
  const lineCount = code.split("\n").length;

  return (
    <div className="ProblemListMain" style={{ width: "100%" }}>
      <div className="submission-card" style={{ padding: "25px" }}>
        <h3 className="section-title">Submission Your Code:</h3>

        <div className="submission-layout">
          {/* Left column: form */}
          <div>
            {/* problem ID */}
            <div className="field">
              <label htmlFor="problemID">Problem ID:</label>
              <input
                id="problemID"
                className="input"
                placeholder="Enter the Problem ID"
                type="number"
                value={problemID}
                onChange={(e) => setProblemID(e.target.value)}
              />
              {((accept && problemID === "") || errors.problemID) && (
                <p className="field-error">
                  {errors.problemID || "You must specify the Problem ID"}
                </p>
              )}
            </div>

            {/* Compiler */}
            <div className="field">
              <label htmlFor="compilerName">Compiler:</label>
              <select
                id="compilerName"
                className="input"
                value={compilerName}
                onChange={(e) => setCompilerName(e.target.value)}
              >
                <option value="">Chose Compiler</option>
                {compilers.map((comp, idx) => (
                  <option key={idx} value={comp.compilerName}>
                    {comp.compilerName}
                  </option>
                ))}
              </select>
              {((accept && !compilerName) || errors.compilerName) && (
                <p className="field-error">
                  {errors.compilerName || "Choose a compiler"}
                </p>
              )}
              <div className="field-hint">
                Pick the language you’re submitting in.
              </div>
            </div>

            {/* visionScope */}
            <div className="field">
              <label>
                Public
                <input
                  className="input1"
                  type="checkbox"
                  checked={visionScope === "all"}
                  onChange={(e) =>
                    setVisionScope(e.target.checked ? "all" : "onlyme")
                  }
                />
              </label>
              <div className="field-hint">
                Do you want to show your result to other users?
              </div>
            </div>

            {/* code editor */}
            <div className="code-editor-wrapper mt-16">
              <div className="line-numbers">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your code here..."
              />
            </div>
            {((accept && !code?.trim()) || errors.code) && (
              <p className="field-error">{errors.code || "Code is required"}</p>
            )}
          </div>

          {/* Right column: result */}
          <div>
            {errorRes && <p className="field-error">Error: {errorRes}</p>}

            {!errorRes && submissionData && (
              <div className="result-card">
                <div className="result-header">
                  <div className="result-title">Submission Result</div>
                  <span
                    className={`chip ${
                      submissionData?.status === "Accepted"
                        ? "chip--success"
                        : (submissionData?.status || "")
                            .toLowerCase()
                            .includes("pending")
                        ? "chip--warn"
                        : "chip--danger"
                    }`}
                  >
                    {submissionData?.status}
                  </span>
                </div>

                <div className="kv">
                  <div className="kv-row">
                    <span className="kv-label">ID</span>
                    <span className="kv-value">
                      {submissionData?.submissionID}
                    </span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Execution Time</span>
                    <span>{submissionData?.executionTimeMilliseconds} ms</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Compiler</span>
                    <span>{submissionData?.compilerName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <Buttons
            onClick={handleSubmit}
            text={isLoading ? "Submitting..." : "Submit the code"}
            disabled={isLoading}
            style={{
              "--color-primer": "#4CAF50",
              opacity: isLoading ? 0.7 : 1,
              pointerEvents: isLoading ? "none" : "auto",
              width: "150px",
              textAlign: "center",
            }}
          />
        </div>
      </div>

      {/* popap message */}
      <Modal
        text={message}
        isActive={isPopupActive}
        setIsActive={setIsPopupActive}
      />
    </div>
  );
}
