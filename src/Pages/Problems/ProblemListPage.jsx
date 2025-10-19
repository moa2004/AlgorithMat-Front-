import React, { useEffect, useState } from "react";
import NavProblem from "../../Components/Problem Components/NavProblem";
import "./ProblemListPage.css";
import DifficultyButtons from "../../Components/Problem Components/DifficultyButtons";
import Pagination from "../../Components/Problem Components/Pagination";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/miniComponents/LoadingSpinner";

export default function ProblemListPage() {
  const [problems, setProblems] = useState([]);
  const [problemsAllData, setProblemsAllData] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ حالة التحميل
  const [error, setError] = useState(null); // ✅ حالة الخطأ

  // Filters state
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(""); // "", "Easy", "Medium", "Hard"
  const [selectedTag, setSelectedTag] = useState(""); // tagID as string
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  // handel Next/Prev Page
  function handelNextPage() {
    if (pageNum < (problemsAllData.totalPages || 1)) {
      setPageNum((prev) => prev + 1);
    }
  }

  function handelPrevPage() {
    if (pageNum > 1) {
      setPageNum((prev) => prev - 1);
    }
  }

  // fetch data
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        params.set("page", pageNum);
        params.set("limit", 20);
        if (title?.trim()) params.set("title", title.trim());
        if (difficulty) params.set("difficulty", difficulty);
        if (selectedTag) params.set("tagIDs", selectedTag);

        const url = `http://localhost:5023/api/v1/problems?${params.toString()}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("فشل جلب البيانات");

        const data = await res.json();
        setProblems(data.items || []);
        setProblemsAllData(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
        setError("❌ حدث خطأ أثناء تحميل قائمة المسائل.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [pageNum, title, difficulty, selectedTag]);

  function handelGoToPrblemPage(id) {
    navigate(`/ProblemPage/${id}`);
  }

  // إحصائيات هذه الصفحة فقط (المعروضة حالياً)
  const totalProblems = problems.length;
  const totalAttempts = problems.reduce(
    (acc, p) => acc + (p.attemptsCount || 0),
    0
  );
  const difficultyCount = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  // Load tags once
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(
          "http://localhost:5023/api/v1/tags"
        );
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setTags(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTags();
  }, []);

  // Helper to truncate long description
  const truncate = (text, max = 100) =>
    typeof text === "string" && text.length > max
      ? text.slice(0, max) + "…"
      : text || "";

  // Show problems
  const renderProblems = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
           Loading data... ⏳ 
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

    if (problems.length === 0) {
      return (
        <tr>
          <td
            colSpan="7"
            style={{ textAlign: "center", padding: "20px", color: "#555" }}
          >
            ⚠️ No problems available
          </td>
        </tr>
      );
    }

    return problems.map((problem) => (
      <tr
        key={problem.problemID}
        style={{ fontWeight: "600", cursor: "pointer" }}
        onClick={() => handelGoToPrblemPage(problem.problemID)}
      >
        <td style={{ color: "#024e96", fontWeight: "700" }}>
          {problem.problemID}
        </td>
        <td>{problem.title}</td>
        <td className="description-cell" title={problem.generalDescription}>
          {truncate(problem.generalDescription, 100)}
        </td>
        <td>
          <DifficultyButtons
            text={problem.difficulty}
            style={{
              "--color-primer":
                problem.difficulty === "Easy"
                  ? "#3eda5dff"
                  : problem.difficulty === "Hard"
                  ? "tomato"
                  : "#f5a623",
              width: "90%",
              fontSize: "12.5px",
            }}
          />
        </td>
        <td>{problem.attemptsCount}</td>
        <td>{problem.createdByUsername}</td>
        <td>
          <div className="tags-cell">
            {problem.tags?.map((tag, index) => (
              <DifficultyButtons
                key={index}
                text={tag.name}
                style={{
                  "--color-primer": "rgba(163, 162, 162, 0.685)",
                  color: "rgba(63, 59, 59, 1)",
                }}
              />
            ))}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="ProblemListMain" style={{ width: "100%" }}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "95%",
          boxShadow: "7px 7px 15px 1px #00000024",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="Problesm-By-User"
            style={{ padding: "20px", width: "100%" }}
          >
            <h3
              style={{
                padding: "10px",
                margin: "10px 0 5px 10px",
                color: "#024e96",
              }}
            >
              All Problems :
            </h3>

            {/* Filters */}
            <div
              className="filters-bar"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px 220px auto",
                gap: 10,
                padding: "10px 15px",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ marginRight: 8, color: "#6b7280" }}
                ></i>
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={title}
                  onChange={(e) => {
                    setPageNum(1);
                    setTitle(e.target.value);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              <select
                value={difficulty}
                onChange={(e) => {
                  setPageNum(1);
                  setDifficulty(e.target.value);
                }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                }}
              >
                <option value="">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedTag}
                onChange={(e) => {
                  setPageNum(1);
                  setSelectedTag(e.target.value);
                }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                }}
              >
                <option value="">All tags</option>
                {tags.map((t) => (
                  <option key={t.tagID} value={t.tagID}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setTitle("");
                  setDifficulty("");
                  setSelectedTag("");
                  setPageNum(1);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#f3f4f6",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                title="Clear filters"
              >
                <i
                  className="fa-solid fa-rotate"
                  style={{ marginRight: 6 }}
                ></i>
                Reset
              </button>
            </div>

            {/* إحصائيات */}
            <div className="s2" style={{ display: "flex", justifyContent: "center" }}>
              <div className="table-stat-bar">
                <div>
                  <i
                    className="fa-solid fa-list-check"
                    style={{ marginRight: 6, color: "#1f4fe0" }}
                  ></i>{" "}
                  Number of problems: {totalProblems}
                </div>
                <div>
                  <i
                    className="fa-solid fa-chart-column"
                    style={{ marginRight: 6, color: "#334155" }}
                  ></i>{" "}
                  Total attempts: {totalAttempts}
                </div>
                <div>
                  <i
                    className="fa-solid fa-circle"
                    style={{ marginRight: 6, color: "#22d3a6" }}
                  ></i>{" "}
                  Easy: {difficultyCount.Easy}
                </div>
                <div>
                  <i
                    className="fa-solid fa-circle"
                    style={{ marginRight: 6, color: "#f59e0b" }}
                  ></i>{" "}
                  Medium: {difficultyCount.Medium}
                </div>
                <div>
                  <i
                    className="fa-solid fa-circle"
                    style={{ marginRight: 6, color: "#ef4444" }}
                  ></i>{" "}
                  Hard: {difficultyCount.Hard}
                </div>
              </div>
            </div>

            {/* <!-- start table --> */}
            <div className="table">
              <div className="par-table">
                <table className="ch-table po-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Difficulty</th>
                      <th>Submisions</th>
                      <th>Created By</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>{renderProblems()}</tbody>
                </table>
              </div>
            </div>
            {/* <!-- end table --> */}
          </div>
        </div>

        <Pagination
          onNext={handelNextPage}
          onPrev={handelPrevPage}
          currentPage={problemsAllData.currentPage || 1}
          totalPage={problemsAllData.totalPages || 1}
        />
      </div>
    </div>
  );
}
