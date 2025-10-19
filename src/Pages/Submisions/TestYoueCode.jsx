import React, { useEffect, useState } from "react";
import "./SubmissionPage.css"; // reuse the unified styles
import Buttons from "../../Components/miniComponents/Buttons";
import axios from "axios";

export default function TestYoueCode() {
  // form state
  const [code, setCode] = useState("");
  const [inputData, setInputData] = useState("");
  const [compilerName, setCompilerName] = useState("");
  const [compilers, setCompilers] = useState([]);

  // ui state
  const [accept, setAccept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorRes, setErrorRes] = useState(null);
  const [outputText, setOutputText] = useState(null);

  // line numbers for editor
  const lineCount = code.split("\n").length;

  // fetch compilers
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

  const validate = () => {
    const e = {};
    if (!compilerName) e.compilerName = "Choose a compiler";
    if (!code?.trim()) e.code = "Code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    setAccept(true);
    setErrorRes(null);
    setOutputText(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        source: code,
        input: inputData || "",
        compiler: compilerName,
      };

      const res = await axios.post(
        "http://localhost:5023/api/v1/compilers/simple-compile",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      if (typeof data === "string") {
        setOutputText(data);
      } else if (data?.output || data?.stdout) {
        setOutputText(data.output || data.stdout);
      } else {
        setOutputText(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      // normalize error
      const resp = error?.response;
      if (resp?.data) {
        try {
          const d = resp.data;
          if (typeof d === "string") {
            setErrorRes(d);
          } else if (d?.errors) {
            // collect validation errors
            const msgs = Object.values(d.errors).flat().join("\n");
            setErrorRes(msgs || d.title || "Request failed");
          } else if (d?.title || d?.message) {
            setErrorRes(d.title || d.message);
          } else {
            setErrorRes(JSON.stringify(d));
          }
        } catch (err) {
          console.log(err);
          setErrorRes("Request failed");
        }
      } else {
        setErrorRes(error?.message || "Request failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ProblemListMain" style={{ width: "100%" }}>
      <div className="submission-card" >
        <h3 className="section-title">Test Your Code:</h3>

        <div className="submission-layout">
          {/* Left: form */}
          <div>
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
                {compilers.map((c, i) => (
                  <option key={i} value={c.compilerName}>
                    {c.compilerName}
                  </option>
                ))}
              </select>
              {((accept && !compilerName) || errors.compilerName) && (
                <p className="field-error">
                  {errors.compilerName || "Choose a compiler"}
                </p>
              )}
            </div>

            {/* Program input */}
            <div className="field">
              <label htmlFor="programInput">Program Input:</label>
              <textarea
                id="programInput"
                className="input"
                rows={4}
                placeholder="Enter stdin here (optional)"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
            </div>

            {/* Code editor */}
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

            <div className="mt-16">
              <Buttons
                onClick={handleSubmit}
                text={isLoading ? "Compiling..." : "Run"}
                disabled={isLoading}
                style={{
                  "--color-primer": "#4CAF50",
                  width: "150px",
                  textAlign: "center",
                  opacity: isLoading ? 0.7 : 1,
                  pointerEvents: isLoading ? "none" : "auto",
                }}
              />
            </div>
          </div>

          {/* Right: result */}
          <div>
            {errorRes && <p className="field-error">{errorRes}</p>}

            {outputText && (
              <div className="result-card">
                <div className="result-header">
                  <div className="result-title">Output</div>
                </div>
                <pre
                  style={{
                    background: "#0b1020",
                    color: "#e2e8f0",
                    padding: 12,
                    borderRadius: 8,
                    maxHeight: 300,
                    overflow: "auto",
                    border: "1px solid #111428",
                  }}
                >
                  <code>{outputText}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
