import React, { useState } from "react";
import axios from "axios";
import ProblemInfoForm from "../../Components/AddProblemPage/ProblemInfoForm";
import DifficultySelector from "../../Components/AddProblemPage/DifficultySelector";
import TagsSelector from "../../Components/AddProblemPage/TagsSelector";
import TestCasesForm from "../../Components/AddProblemPage/TestCasesForm";
import "./AddProblemPage.css";
import Buttons from "../../Components/miniComponents/Buttons";
import Modal from "../../Components/Modal";
import HelperMessage from "../../Components/miniComponents/HelperMessage";
import AuthRequiredMessage from "../../Components/miniComponents/AuthRequiredMessage";

export default function AddProblemPage() {
  const [problemData, setProblemData] = useState({
    compilerName: "clang1810",
    title: "",
    generalDescription: "",
    inputDescription: "",
    outputDescription: "",
    note: "",
    tutorial: "",
    difficulty: "Easy",
    solutionCode: "",
    timeLimitMilliseconds: 500,
    testCases: [],
    tagIDs: [],
  });
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setProblemData((prev) => ({ ...prev, [field]: value }));
  };

  const stored = localStorage.getItem("userAuth");
  const token = stored ? JSON.parse(stored) : null;
  const userToken = token?.userData?.token ?? null;

  const handleSubmit = async () => {
    if (!userToken) {
      setMessage(Auth);
      setIsPopupActive(true);
      return;
    }

    const pd = problemData;
    const missing = [];

    if (!pd.title?.trim()) missing.push("Title");
    if (!pd.compilerName) missing.push("Compiler");
    if (!pd.generalDescription?.trim()) missing.push("General description");
    if (!pd.inputDescription?.trim()) missing.push("Input description");
    if (!pd.outputDescription?.trim()) missing.push("Output description");
    if (!pd.solutionCode?.trim()) missing.push("Solution code");
    if (!pd.timeLimitMilliseconds && pd.timeLimitMilliseconds !== 0)
      missing.push("Time limit (ms)");
    if (!pd.difficulty) missing.push("Difficulty");
    if (!pd.tagIDs || pd.tagIDs.length === 0) missing.push("At least one tag");
    if (!pd.testCases || pd.testCases.length === 0)
      missing.push("At least one test case");

    if (missing.length > 0) {
      setMessage(
        <HelperMessage
          variant="warning"
          title="Please fill all required fields"
          description={
            <div>
              <p>Missing fields:</p>
              <ul>
                {missing.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          }
          actions={[
            {
              type: "button",
              label: "OK",
              onClick: () => setIsPopupActive(false),
            },
          ]}
        />
      );
      setIsPopupActive(true);
      return;
    }
    try {
      console.log("DATA SENT TO BACKEND:", problemData);
      const res = await axios.post(
        "http://localhost:5023/api/v1/problems",
        problemData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("RESPONSE:", res.data);
      setMessage(
        <HelperMessage
          variant="success"
          title="Problem added successfully"
          description="You can now view the problems list or add another one."
          actions={[
            { type: "link", label: "View Problems", to: "/Problems" },
            {
              type: "button",
              label: "Add another",
              onClick: () => setIsPopupActive(false),
            },
          ]}
        />
      );
      setIsPopupActive(true);
    } catch (err) {
      console.error("BACKEND ERROR:", err.response?.data || err.message);
      setMessage(
        <HelperMessage
          variant="error"
          title="An error occurred while adding"
          description={
            err.response?.data?.message || "Please check required fields."
          }
          actions={[
            {
              type: "button",
              label: "OK",
              onClick: () => setIsPopupActive(false),
            },
          ]}
        />
      );
      setIsPopupActive(true);
    }
  };

  const Auth = <AuthRequiredMessage />;

  return (
    <div
      className="ProblemListMain"
      style={{ width: "100%", display: "garde" }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "95%",
          boxShadow: "7px 7px 15px 1px #00000024",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
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
              Add new Problem:
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ padding: "10px", width: "95%" }}>
                <ProblemInfoForm
                  problemData={problemData}
                  onChange={handleChange}
                />

                <DifficultySelector
                  selected={problemData.difficulty}
                  onSelect={(value) => handleChange("difficulty", value)}
                />
                <div className="flex">
                  <TagsSelector
                    selected={problemData.tagIDs}
                    onChange={(tags) => handleChange("tagIDs", tags)}
                  />
                </div>

                <TestCasesForm
                  testCases={problemData.testCases}
                  onChange={(cases) => handleChange("testCases", cases)}
                />
                <Buttons
                  text="Add Problem"
                  onClick={handleSubmit}
                  style={{ marginTop: "20px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        text={message}
        isActive={isPopupActive}
        setIsActive={setIsPopupActive}
      />
    </div>
  );
}
