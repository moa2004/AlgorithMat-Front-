import React, { useEffect, useState } from "react";
import ProfileCard from "../../Components/Profile Componennts/ProfileCard";
import DifficultyButtons from "../../Components/Problem Components/DifficultyButtons";
import Pagination from "../../Components/Problem Components/Pagination";
import LoadingSpinner from "../../Components/miniComponents/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import UserAvatar from "../../Components/Profile Componennts/UserAvatar";
import UserStatistics from "../../Components/Profile Componennts/UserStatistics";
import UserSubmissions from "../../Components/Profile Componennts/UserSubmissions";
import Modal from "../../Components/Modal";

export default function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem("userAuth")); // 👈 جلب بيانات المستخدم
  const userId = storedUser?.userData?.userId;
  const userName = storedUser?.userData?.userName;

  const [stats, setStats] = useState(null);
  const [problems, setProblems] = useState([]);
  const [problemsAllData, setProblemsAllData] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User info state
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [userInfoError, setUserInfoError] = useState(null);

  // Change password modal state
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(null);

  const navigate = useNavigate();

  // 📌 جلب الإحصائيات
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:5023/api/v1/Statistics/users/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [userId]);

  // 📌 جلب معلومات المستخدم (createdAt, isActive)
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        setUserInfoLoading(true);
        setUserInfoError(null);
        const res = await fetch(
          `http://localhost:5023/api/v1/users/id/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error(err);
        setUserInfoError("Failed to load user data");
      } finally {
        setUserInfoLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // 📌 جلب المسائل التي أضافها المستخدم
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:5023/api/v1/problems?page=${pageNum}&limit=20&createdBy=${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch problems");
        const data = await res.json();

        setProblems(data.items || []);
        setProblemsAllData(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
        setError("❌ An error occurred while loading the problem list.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [pageNum, userId]);

  // 📌 الانتقال لصفحة المسألة
  function handelGoToPrblemPage(id) {
    navigate(`/ProblemPage/${id}`);
  }

  // 📌 عرض المسائل
  const renderProblems = () => {
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
          <td colSpan="7" style={{ textAlign: "center", color: "tomato" }}>
            {error}
          </td>
        </tr>
      );
    }

    if (problems.length === 0) {
      return (
        <tr>
          <td colSpan="7" style={{ textAlign: "center", color: "#555" }}>
            ⚠️ You haven't added any problems yet
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
          {typeof problem.generalDescription === "string" &&
          problem.generalDescription.length > 100
            ? problem.generalDescription.slice(0, 100) + "…"
            : problem.generalDescription || ""}
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
              width: "80%",
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
    <div className="ProfilePage">
      <div className="ProblemListMain" style={{ width: "100%" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            width: "95%",
            boxShadow: "7px 7px 15px 1px #00000024",
          }}
        >
          <div className="user-profilr flex" style={{ padding: "30px" }}>
            <div className="photo-username">
              <div className="flex">
                <UserAvatar />
                <h2
                  style={{
                    textAlign: "center",
                    margin: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    User Name:{" "}
                    <span style={{ color: "#024e96" }}>{userName}</span>
                  </span>

                  {/* loading and error indicators */}
                  {userInfoLoading && (
                    <span style={{ color: "#185abc", fontSize: 14 }}>
                      Loading user...
                    </span>
                  )}
                  {userInfoError && (
                    <span style={{ color: "tomato", fontSize: 14 }}>
                      {userInfoError}
                    </span>
                  )}

                  {/* isActive badge */}
                  {!userInfoLoading && !userInfoError && userInfo && (
                    <span
                      title={userInfo.isActive ? "Active" : "Inactive"}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 14,
                        background: userInfo.isActive ? "#E6F4EA" : "#FCE8E6",
                        color: userInfo.isActive ? "#137333" : "#B3261E",
                        border: `1px solid ${
                          userInfo.isActive ? "#CEEAD6" : "#F4C7C3"
                        }`,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: userInfo.isActive ? "#34A853" : "#EA4335",
                          boxShadow: userInfo.isActive
                            ? "0 0 0 3px rgba(52,168,83,0.15)"
                            : "0 0 0 3px rgba(234,67,53,0.15)",
                        }}
                      />
                      {userInfo.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </h2>
                {/* createdAt under username */}
                {!userInfoLoading && !userInfoError && userInfo && (
                  <div
                    style={{
                      margin: "-10px 20px 0 20px",
                      color: "#4b4d50ff",
                      fontSize: 14,
                    }}
                  >
                    Joined: {new Date(userInfo.createdAt).toDateString()}
                  </div>
                )}
              </div>
            </div>
            <div>
              <i
                className="fa-solid fa-user-pen settings-icon"
                style={{
                  fontSize: "25px",
                  marginRight: "15px",
                  color: "#024e96",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.9)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onClick={() => setIsChangePwdOpen(true)}
                title="Change password"
              ></i>
            </div>
          </div>

          {/* 🔹 Cards للإحصائيات */}
          <div className="cards-container">
            <ProfileCard
              style={{ marginRight: "40px" }}
              text="Solved problems"
              num={stats?.totalSolved || 0}
            />
            <ProfileCard
              text="Number of attempts"
              num={stats?.totalAttempts || 0}
              style={{ marginRight: "40px" }}
            />

            <ProfileCard
              style={{ marginRight: "40px" }}
              text="Added Problems"
              num={stats?.numberOfCreatedProblem || 0}
            />
            <ProfileCard
              text="Acceptance Rate"
              num={stats?.acceptanceRate.toFixed(3) || 0}
            />
          </div>
        </div>
      </div>
      {/* 🔹 جدول المسائل */}
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
              <h3 style={{ padding: "10px", margin: "10px 0 5px 10px" }}>
                The Problems you added:
              </h3>
              {/* جدول */}
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
            </div>
          </div>

          <Pagination
            onNext={() => setPageNum((prev) => prev + 1)}
            onPrev={() => setPageNum((prev) => Math.max(prev - 1, 1))}
            currentPage={problemsAllData.currentPage || 1}
            totalPage={problemsAllData.totalPages || 1}
          />
        </div>
      </div>

      {/* Your Submissions section */}
      <div className="ProblemListMain" style={{ width: "100%" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            width: "95%",
            boxShadow: "7px 7px 15px 1px #00000024",
            padding: "20px",
          }}
        >
          <h3 style={{ padding: "10px", margin: "10px 0 5px 10px" }}>
            Your Submissions:
          </h3>
          <UserSubmissions userId={userId} />
        </div>
      </div>

      <div>
        <div className="ProblemListMain" style={{ width: "100%" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              width: "95%",
              boxShadow: "7px 7px 15px 1px #00000024",
              padding: "30px",
            }}
          >
            <h3>Statistics</h3>

            <UserStatistics userId={userId} />
          </div>
        </div>
      </div>
      {/* Change Password Modal */}
      <Modal
        isActive={isChangePwdOpen}
        setIsActive={setIsChangePwdOpen}
        style={{
          maxWidth: "420px",
          width: "95%",
          backgroundColor: "#cfccccff",
        }}
      >
        <h3 style={{ marginBottom: "10px", color: "#185abc" }}>
          Change Password
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setPwdError(null);
            setPwdSuccess(null);
            setPwdLoading(true);
            try {
              const token = storedUser?.userData?.token;
              const res = await fetch(
                "http://problem-solving.runasp.net/api/v1/auth/change-password",
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    oldPassword: pwdForm.oldPassword,
                    newPassword: pwdForm.newPassword,
                  }),
                }
              );

              if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Failed to change password");
              }

              setPwdSuccess("✅ Password changed successfully");
              setPwdForm({ oldPassword: "", newPassword: "" });
            } catch (err) {
              setPwdError(
                "❌ An error occurred. Please check the data and try again."
              );
              console.error(err);
            } finally {
              setPwdLoading(false);
            }
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <label style={{ fontWeight: "bolder" }}>
              Old Password
              <input
                type="password"
                value={pwdForm.oldPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, oldPassword: e.target.value })
                }
                required
                placeholder="Enter old password"
                style={{ width: "100%", padding: "8px" }}
              />
            </label>
            <label style={{ fontWeight: "bolder" }}>
              New Password
              <input
                type="password"
                value={pwdForm.newPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, newPassword: e.target.value })
                }
                required
                placeholder="Enter new password"
                style={{ width: "100%", padding: "8px" }}
              />
            </label>
            {pwdError && (
              <p style={{ color: "tomato", fontWeight: 600 }}>{pwdError}</p>
            )}
            {pwdSuccess && (
              <p style={{ color: "#2a9d8f", fontWeight: 600 }}>{pwdSuccess}</p>
            )}
            <button
              type="submit"
              disabled={pwdLoading}
              style={{
                background: "#024e96",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                opacity: pwdLoading ? 0.7 : 1,
              }}
            >
              {pwdLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
