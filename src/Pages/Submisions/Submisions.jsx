import React, { useEffect, useState } from "react";
import NavProblem from "../../Components/Problem Components/NavProblem";
import Pagination from "../../Components/Problem Components/Pagination";
import DifficultyButtons from "../../Components/Problem Components/DifficultyButtons";
import LoadingSpinner from "../../Components/miniComponents/LoadingSpinner";
import Modal from "../../Components/Modal";
import AuthRequiredMessage from "../../Components/miniComponents/AuthRequiredMessage";
export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({}); 
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPopupActive, setIsPopupActive] = useState(false);
  const [popupContent, setPopupContent] = useState(null); 
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const rawAuth = localStorage.getItem("userAuth");
  let token = null;
  try {
    token = rawAuth ? JSON.parse(rawAuth)?.userData?.token ?? null : null;
  } catch (e) {
    console.log(e);
    token = null;
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:5023/api/v1/submissions?page=${pageNum}&limit=20`
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setSubmissions(data.items || []);
        setMeta(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("❌ An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [pageNum]);

  const totalSubmissions = submissions.length;
  const avgExecutionMs = totalSubmissions
    ? Math.round(
        submissions.reduce(
          (acc, s) => acc + (s.executionTimeMilliseconds || 0),
          0
        ) / totalSubmissions
      )
    : 0;
  const acceptedCount = submissions.filter(
    (s) => s.status === "Accepted"
  ).length;
  const notAcceptedCount = totalSubmissions - acceptedCount;
  const distinctCompilers = new Set(
    submissions.map((s) => s.compilerName).filter(Boolean)
  ).size;
  const distinctUsers = new Set(
    submissions.map((s) => s.username).filter(Boolean)
  ).size;

  const handleOpenDetails = async (submissionID) => {
    try {
      if (!token) {
        setPopupContent(<AuthRequiredMessage compact />);
        setIsPopupActive(true);
        return;
      }

      setIsPopupActive(true);
      setDetailsLoading(true);
      setDetailsError(null);
      setPopupContent(null);

      const res = await fetch(
        `http://localhost:5023/api/v1/submissions/details/${submissionID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!res.ok)
        throw new Error(`Failed to fetch solution details (${res.status})`);
      const data = await res.json();

      const info = data?.submissionInfo || {};
      const tests = data?.submissionsTestCases || [];
      const node = (
        <div
          style={{
            maxWidth: 500,
          }}
        >
          <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>
            Solution details #{info.submissionID}
          </h4>

          <div
            style={{
              display: "grid",
              rowGap: 8,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#2f86c4" }}>Problem</span>
              <span style={{ fontWeight: 700 }}>
                {info.problemTitle} (ID: {info.problemID})
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#2f86c4" }}>User</span>
              <span>{info.username}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#2f86c4" }}>Compiler</span>
              <span>{info.compilerName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#2f86c4" }}>Status</span>
              <span>{info.status}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#2f86c4" }}>Execution</span>
              <span>{info.executionTimeMilliseconds} ms</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#2f86c4" }}>Submitted</span>
              <span>
                {info.submittedAt
                  ? new Date(info.submittedAt).toLocaleString()
                  : ""}
              </span>
            </div>
          </div>

          <div style={{ margin: "12px 0", fontWeight: 700 }}>Code</div>
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
            <code>{info.code || "(no code)"}</code>
          </pre>

          <div style={{ margin: "12px 0 8px", fontWeight: 700 }}>
            Test Cases
          </div>
          {tests.length === 0 ? (
            <div style={{ color: "#e6e8ecff" }}>No test case results</div>
          ) : (
            <div
              style={{
                display: "grid",
                rowGap: 10,
              }}
            >
              {tests.map((t) => (
                <div
                  key={t.submissionTestCaseID}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 10,
                    background: "#383737fd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <strong>Case #{t.testCaseID}</strong>
                    <span
                      style={{
                        color: (t.status || "").includes("Accepted")
                          ? "#22c55e"
                          : "tomato",
                        fontWeight: 700,
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      maxWidth: "300px",
                      overflow: "auto",
                    }}
                  >
                    <div>
                      <span style={{ color: "#2f86c4" }}>Input:</span>{" "}
                      <code>{t.input}</code>
                    </div>
                    <div>
                      <span style={{ color: "#2f86c4" }}>Expected:</span>{" "}
                      <code>{t.expectedOutput}</code>
                    </div>
                    <div>
                      <span style={{ color: "#2f86c4" }}>Output:</span>{" "}
                      <code>{t.output}</code>
                    </div>
                    <div>
                      <span style={{ color: "#2f86c4" }}>Time:</span>{" "}
                      {t.executionTimeMilliseconds} ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      setPopupContent(node);
    } catch (e) {
      console.error(e);
      setDetailsError(e.message || "An error occurred");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handelNextPage = () => {
    if (pageNum < (meta.totalPages || 1)) {
      setPageNum((prev) => prev + 1);
    }
  };

  const handelPrevPage = () => {
    if (pageNum > 1) {
      setPageNum((prev) => prev - 1);
    }
  };

  const renderSubmissions = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
            ⏳ Loading data...
            <LoadingSpinner />
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td
            colSpan="7"
            style={{ textAlign: "center", color: "tomato", padding: "20px" }}
          >
            {error}
          </td>
        </tr>
      );
    }

    if (submissions.length === 0) {
      return (
        <tr>
          <td
            colSpan="7"
            style={{ textAlign: "center", padding: "20px", color: "#555" }}
          >
            ⚠️ No results
          </td>
        </tr>
      );
    }

    return submissions.map((submission, index) => (
      <tr
        key={submission.submissionID || index}
        style={{ cursor: "pointer" }}
        onClick={() => handleOpenDetails(submission.submissionID)}
        title="Show solution details"
      >
        <td className="id-cell">{submission.submissionID}</td>
        <td>{submission.problemTitle}</td>
        <td>{submission.executionTimeMilliseconds} ms</td>
        <td>{submission.username}</td>
        <td>
          <DifficultyButtons
            text={submission.status}
            style={{
              "--color-primer":
                submission.status === "Accepted" ? "#3eda5dff" : "tomato",
              width: "90%",
              fontSize: "14px",
            }}
          />
        </td>
        <td>{submission.compilerName}</td>
        <td className="description-cell">
          {new Date(submission.submittedAt).toLocaleString()}
        </td>
      </tr>
    ));
  };

  return (
    <div className="ProblemListMain">
      {/* Show a unified auth banner on top if user not logged in */}
      {!token && (
        <div
          style={{
            margin: "0 0 12px",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>
      )}
      <div className="table-wrapper">
        <h3
          style={{
            padding: "10px",
            margin: "10px 0 5px 10px",
            color: "#024e96",
          }}
        >
          Submissions List
        </h3>

        <div
          className="s2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "15px",
              background: "#f9f9f9",
              borderRadius: "8px",
              margin: "10px 0",
              fontWeight: "600",
              width: "100%",
            }}
          >
            <div>
              <i
                className="fa-solid fa-list-check"
                style={{ marginRight: 6, color: "#024e96" }}
              ></i>{" "}
              Submissions: {totalSubmissions}
            </div>
            <div>
              <i
                className="fa-regular fa-clock"
                style={{ marginRight: 6, color: "#6b7280" }}
              ></i>{" "}
              Avg execution: {avgExecutionMs} ms
            </div>
            <div>
              <i
                className="fa-solid fa-circle-check"
                style={{ marginRight: 6, color: "#22c55e" }}
              ></i>{" "}
              Accepted: {acceptedCount}
            </div>
            <div>
              <i
                className="fa-solid fa-circle-xmark"
                style={{ marginRight: 6, color: "#ef4444" }}
              ></i>{" "}
              Not accepted: {notAcceptedCount}
            </div>
            <div>
              <i
                className="fa-solid fa-code"
                style={{ marginRight: 6, color: "#6366f1" }}
              ></i>{" "}
              Compilers: {distinctCompilers}
            </div>
            <div>
              <i
                className="fa-solid fa-user"
                style={{ marginRight: 6, color: "#0ea5e9" }}
              ></i>{" "}
              Users: {distinctUsers}
            </div>
          </div>
        </div>

        <div className="par-table">
          <table className="ch-table po-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Problem Title</th>
                <th>Execution Time</th>
                <th>Solution By</th>
                <th>Status</th>
                <th>Compiler Name</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>{renderSubmissions()}</tbody>
          </table>
        </div>

        <Pagination
          onNext={handelNextPage}
          onPrev={handelPrevPage}
          currentPage={meta.currentPage || 1}
          totalPage={meta.totalPages || 1}
        />
      </div>

      {/* Modal for details */}
      <Modal
        text={
          detailsLoading ? (
            <span>
              Loading details...
              <LoadingSpinner />
            </span>
          ) : detailsError ? (
            <span style={{ color: "tomato" }}>{detailsError}</span>
          ) : (
            popupContent
          )
        }
        isActive={isPopupActive}
        setIsActive={setIsPopupActive}
        style={{
          "max-width": "500px",
        }}
      />
    </div>
  );
}
