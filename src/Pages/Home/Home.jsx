import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/miniComponents/LoadingSpinner";
import Modal from "../../Components/Modal";
import AuthRequiredMessage from "../../Components/miniComponents/AuthRequiredMessage";
import WelcomeHero from "../../Components/Home/WelcomeHero";
import FeaturesGrid from "../../Components/Home/FeaturesGrid";
import StatsGrid from "../../Components/Home/StatsGrid";
import MostSolvedList from "../../Components/Home/MostSolvedList";
import LatestSubmissions from "../../Components/Home/LatestSubmissions";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const username = useMemo(() => {
    try {
      const raw = window.localStorage.getItem("userAuth");
      if (!raw) return null;
      const parsed = JSON.parse(raw)?.userData || null;
      return (
        parsed?.username ||
        parsed?.user?.username ||
        parsed?.name ||
        parsed?.userName ||
        null
      );
    } catch {
      return null;
    }
  }, []);

  const [stats, setStats] = useState(null);
  const [latestProblems, setLatestProblems] = useState([]);
  const [latestSubs, setLatestSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPopupActive, setIsPopupActive] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const rawAuth =
    typeof window !== "undefined" ? localStorage.getItem("userAuth") : null;
  let token = null;
  try {
    token = rawAuth ? JSON.parse(rawAuth)?.userData?.token ?? null : null;
  } catch (err) {
    console.log(err);
    token = null;
  }

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const sRes = await fetch(
          "http://localhost:5023/api/v1/Statistics"
        );
        if (!sRes.ok) throw new Error("Failed to fetch statistics");
        const sData = await sRes.json();

        const pRes = await fetch(
          "http://localhost:5023/api/v1/problems?page=1&limit=50"
        );
        if (!pRes.ok) throw new Error("Failed to fetch problems");
        const pData = await pRes.json();

        const subRes = await fetch(
          "http://localhost:5023/api/v1/submissions?page=1&limit=5"
        );
        if (!subRes.ok) throw new Error("Failed to fetch submissions");
        const subData = await subRes.json();

        if (!canceled) {
          setStats(sData || null);
          const items = Array.isArray(pData?.items) ? pData.items : [];
          const mostSolved = items
            .slice()
            .sort((a, b) => (b.attemptsCount || 0) - (a.attemptsCount || 0))
            .slice(0, 6);
          setLatestProblems(mostSolved);
          setLatestSubs(Array.isArray(subData?.items) ? subData.items : []);
        }
      } catch (e) {
        if (!canceled) setError(e.message || "Unexpected error occurred");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, []);

  const handleOpenProblem = (id) => navigate(`/ProblemPage/${id}`);
  const handleOpenSubmission = async (submissionID) => {
    try {
      if (!token) {
        setIsPopupActive(true);
        setPopupContent(<AuthRequiredMessage compact />);
        return;
      }

      setIsPopupActive(true);
      setDetailsLoading(true);
      setDetailsError(null);
      setPopupContent(null);

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(
        `http://localhost:5023/api/v1/submissions/details/${submissionID}`,
        { headers }
      );
      if (!res.ok)
        throw new Error(`Failed to fetch submission details (${res.status})`);
      const data = await res.json();

      const info = data?.submissionInfo || {};
      const tests = data?.submissionsTestCases || [];
      const node = (
        <div style={{ maxWidth: 500 }}>
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
            <div style={{ display: "grid", rowGap: 10 }}>
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
      setDetailsError(e.message || "An error occurred");
    } finally {
      setDetailsLoading(false);
    }
  };
 
  return (
    <div className="ProblemListMain" dir="ltr" style={{ width: "100%" }}>
      <div className="home-card">
        {/* Welcome / Hero */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px 10px",
          }}
        >
          <div className="child" style={{ width: "100%", maxWidth: 1000 }}>
            <WelcomeHero username={username} />
          </div>
        </div>

        {/* Features */}
        <FeaturesGrid />

        <hr
          style={{
            background: "#eee",
            height: "10px",
            border: "none",
            marginTop: 18,
          }}
        />

        {/* Stats */}
        <StatsGrid stats={stats} loading={loading} />
        <hr style={{ background: "#eee", height: "10px", border: "none" }} />

        {/* Content lists */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="lists-grid">
            {/* Latest problems */}
            <MostSolvedList
              latestProblems={latestProblems}
              loading={loading}
              error={error}
              onOpen={handleOpenProblem}
            />

            {/* Latest submissions */}
            <LatestSubmissions
              latestSubs={latestSubs}
              loading={loading}
              error={error}
              onOpen={handleOpenSubmission}
            />
          </div>
        </div>

        {/* Submission details modal */}
        <Modal
          isActive={isPopupActive}
          setIsActive={setIsPopupActive}
          style={{ maxWidth: 600 }}
        >
          {detailsLoading ? (
            <div style={{ textAlign: "center", padding: 10 }}>
              <LoadingSpinner />
            </div>
          ) : detailsError ? (
            <div style={{ color: "tomato", padding: 10 }}>
              ⚠️ {detailsError}
            </div>
          ) : (
            popupContent
          )}
        </Modal>
      </div>
    </div>
  );
}
