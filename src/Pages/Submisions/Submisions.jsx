import React, { useEffect, useState } from "react";
import Pagination from "../../Components/Problem Components/Pagination";
import LoadingSpinner from "../../Components/miniComponents/LoadingSpinner";
import Modal from "../../Components/Modal";
import AuthRequiredMessage from "../../Components/miniComponents/AuthRequiredMessage";
import "./Submisions.css";

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
        setError("An error occurred while loading data.");
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

  const statsSummary = [
    {
      icon: "fa-solid fa-list-check",
      label: "Submissions",
      value: totalSubmissions,
      tone: "primary",
    },
    {
      icon: "fa-regular fa-clock",
      label: "Avg execution",
      value: `${avgExecutionMs} ms`,
      tone: "info",
    },
    {
      icon: "fa-solid fa-circle-check",
      label: "Accepted",
      value: acceptedCount,
      tone: "success",
    },
    {
      icon: "fa-solid fa-circle-xmark",
      label: "Not accepted",
      value: notAcceptedCount,
      tone: "danger",
    },
    {
      icon: "fa-solid fa-code",
      label: "Compilers",
      value: distinctCompilers,
      tone: "secondary",
    },
    {
      icon: "fa-solid fa-user",
      label: "Users",
      value: distinctUsers,
      tone: "accent",
    },
  ];

  const currentPage = meta.currentPage || 1;
  const totalPages = meta.totalPages || 1;

  const getStatusKey = (status = "") => {
    const normalized = status.toLowerCase();
    if (normalized.includes("accept")) return "accepted";
    if (normalized.includes("pending")) return "pending";
    if (normalized.includes("queue") || normalized.includes("run"))
      return "running";
    return "rejected";
  };

  const renderSubmissions = () => {
    if (loading) {
      return (
        <tr className="submissions-table__message">
          <td colSpan="7">
            <div className="table-status">
              <LoadingSpinner />
              <span>Loading data...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr className="submissions-table__message">
          <td colSpan="7">
            <div className="table-status table-status--error">{error}</div>
          </td>
        </tr>
      );
    }

    if (submissions.length === 0) {
      return (
        <tr className="submissions-table__message">
          <td colSpan="7">
            <div className="table-status table-status--empty">
              No submissions found.
            </div>
          </td>
        </tr>
      );
    }

    return submissions.map((submission) => {
      const statusKey = getStatusKey(submission.status || "");
      return (
        <tr
          key={submission.submissionID}
          className="submissions-row"
          onClick={() => handleOpenDetails(submission.submissionID)}
          title="Show solution details"
        >
          <td className="id-cell">{submission.submissionID}</td>
          <td className="title-cell">{submission.problemTitle}</td>
          <td>{submission.executionTimeMilliseconds} ms</td>
          <td>{submission.username}</td>
          <td>
            <span className={`status-pill ${statusKey}`}>
              <span className="status-pill__dot" />
              {submission.status || "Unknown"}
            </span>
          </td>
          <td>{submission.compilerName}</td>
          <td className="description-cell">
            {new Date(submission.submittedAt).toLocaleString()}
          </td>
        </tr>
      );
    });
  };

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
            <div style={{ color: "#e6e8ec" }}>No test case results</div>
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
                    background: "#1e1e2f",
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
                      maxWidth: "320px",
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPageNum((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageNum((prev) => prev - 1);
    }
  };

  return (
    <div className="submissions-page">
      <div className="submissions-shell">
        <header className="submissions-header">
          <h1 className="submissions-title">Submissions List</h1>
          <p className="submissions-subtitle">
            Track the latest results, execution times, and compiler details for
            every submission.
          </p>
        </header>

        <section className="submissions-stats">
          {statsSummary.map((stat) => (
            <div key={stat.label} className="submissions-stat">
              <span className={`submissions-stat__icon ${stat.tone}`}>
                <i className={stat.icon} aria-hidden="true" />
              </span>
              <div className="submissions-stat__content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="submissions-table-card">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Problem Title</th>
                <th>Execution Time</th>
                <th>Solution By</th>
                <th>Status</th>
                <th>Compiler</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>{renderSubmissions()}</tbody>
          </table>
        </div>

        <Pagination
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          currentPage={currentPage}
          totalPage={totalPages}
        />
      </div>

      <Modal
        text={
          detailsLoading ? (
            <div className="modal-status">
              <LoadingSpinner />
              <span>Loading details...</span>
            </div>
          ) : detailsError ? (
            <div className="modal-status modal-status--error">
              {detailsError}
            </div>
          ) : (
            popupContent
          )
        }
        isActive={isPopupActive}
        setIsActive={setIsPopupActive}
        style={{ maxWidth: 500 }}
      />
    </div>
  );
}
