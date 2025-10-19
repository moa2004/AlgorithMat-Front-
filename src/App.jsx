import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Home from "./Pages/Home/Home";
import ProblemListPage from "./Pages/Problems/ProblemListPage";
import ProblemList from "./Pages/Problems/ProblemPage/ProblemList";
import AddProblemPage from "./Pages/Problems/AddProblemPage";
import Footer from "./Components/Footer";
import Login from "./Pages/Login&SinUp/Login";
import SinUp from "./Pages/Login&SinUp/SinUp";
import ProfileCard from "./Components/Profile Componennts/ProfileCard";
import Submisions from "./Pages/Submisions/Submisions";
import Profile from "./Pages/Home/Profile";
import NavProblem from "./Components/Problem Components/NavProblem";
import TestYoueCode from "./Pages/Submisions/TestYoueCode";
import SubmissionPage from "./Pages/Submisions/SubmissionPage";
import Modal from "./Components/Modal";
import ProblemPage from "./Pages/Problems/ProblemPage/ProblemPage";
import PackGround from "./assets/Group 231.png";
function Layout({ children }) {
  const location = useLocation();
  const hideLayout = ["/LogIn", "/Register"].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          {/* Default route: redirect root to Home */}
          <Route path="/" element={<Navigate to="/Home" replace />} />

          <Route path="/LogIn" element={<Login />} />
          <Route path="/Register" element={<SinUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/ProblemPage/:id" element={<ProblemPage />} />
          {/* <Route path="/ProblemList" element={<ProblemList />}>
            <Route
              path="/ProblemList/testYourCode"
              element={<TestYoueCode />}
            />
            <Route
              path="/ProblemList/problemListPge"
              element={<ProblemListPage />}
            />
            <Route path="/ProblemList/Submision" element={<SubmissionPage />} />
          </Route> */}

          <Route path="/ProblemList" element={<ProblemList />}>
            {/* Default redirect to the first subpage */}
            <Route index element={<Navigate to="problemListPge" replace />} />
            <Route path="testYourCode" element={<TestYoueCode />} />
            <Route path="problemListPge" element={<ProblemListPage />} />
            <Route path="Submision" element={<SubmissionPage />} />
            <Route path="Submision/:id" element={<SubmissionPage />} />{" "}
          </Route>
          <Route path="/AddProblem" element={<AddProblemPage />} />
          <Route path="/Submisions" element={<Submisions />} />
          <Route path="/Profile" element={<Profile />} />

          {/* Fallback: redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
