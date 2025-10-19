import React from "react";
import Buttons from "./miniComponents/Buttons";
import "./Header.css";
import logo from "../assets/algorithmat-logo.svg";
import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import UserAvatar from "./Profile Componennts/UserAvatar";

export default function Header() {
  // Get user data from localStorage
  const storedUser = window.localStorage.getItem("User");
  // Parse JSON if present
  const user = storedUser ? JSON.parse(storedUser) : null;

  // We will fetch data from the server by username later

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="AlgorithMat logo" />
        <div className="logo__text">
          <span className="logo__title">AlgorithMat</span>
          <span className="logo__tagline">Solve • Learn • Improve</span>
        </div>
      </div>
      <nav className="navbar">
        <ul>
          <li>
            <NavLink to="/Home" className="a">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/ProblemList" className="a">
              Problem List
            </NavLink>
          </li>
          <li>
            <NavLink to="/Submisions" className="a">
              Submisions
            </NavLink>
          </li>

          <li>
            <NavLink to="/AddProblem" className="a">
              Add Problem
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex">
        {!window.localStorage.getItem("userAuth") ? (
          <div>
            <Link to="/LogIn ">
              <Buttons
                text="Log In"
                style={{ marginRight: "5px", "--color-primer": "#1e88e5 " }}
              />
            </Link>
            <Link to="/Register ">
              <Buttons text="Sign Up" style={{ "--color-primer": "#10b981" }} />
            </Link>
          </div>
        ) : (
          <Link
            to="/Profile"
            style={{
              "text-decoration": "none",
            }}
          >
            <div className="flex user-name-header" style={{ color: "black" }}>
              <span className="username" style={{ marginRight: "10px" }}>
                {JSON.parse(localStorage.getItem("userAuth")).userData.userName}
              </span>
              <UserAvatar className="user-image" />
            </div>
          </Link>
        )}
        {window.localStorage.getItem("userAuth") ? (
          <UserMenu user={user} />
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

{
  /* <span class="username">mohammed.1</span>
        <img
          src="IMG_20230925_155150_767.jpg"
          alt="User Profile"
          class="user-image"
        /> */
}
