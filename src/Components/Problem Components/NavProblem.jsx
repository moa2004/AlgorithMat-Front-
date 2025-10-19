import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavProblem.css";

export default function NavProblem() {
  return (
    <div style={{ justifyContent: "center" }}>
      <div className="Nav-problem-main flex">
        <div className="Nav-problem-page" style={{ width: "60%" }}>
          <NavLink
            className="Link-decoration space a"
            to={"/ProblemList/problemListPge"}
          >
            Problem List
          </NavLink>
          <NavLink
            className="Link-decoration space a"
            to={"/ProblemList/Submision"}
          >
            Submision
          </NavLink>
          <NavLink
            className="Link-decoration space a"
            to={"/ProblemList/testYourCode"}
          >
            Test Your Code{" "}
          </NavLink>
        </div>
        <div style={{ width: "40%" }}></div>
      </div>
      <hr className="hr-problem" style={{ width: "100%" }} />
    </div>
  );
}
