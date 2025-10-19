import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SignUp.css";
import logo from "/src/assets/algorithmat-logo.svg";

export default function Login() {
  const [myForm, setMyForm] = useState({
    Username: "",
    password: "",
  });
  const [accept, setAccept] = useState(false);
  const [Error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleErrors() {
    setAccept(true);
  }

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };


  let Less_8 = myForm.password.length < 8;
  const hasSpaceInUsername = /\s/.test(myForm.Username);

  async function hanndelSendData() {
    let flag = true;
    if (Less_8 || myForm.Username === "" || hasSpaceInUsername) {
      flag = false;
    } else {
      flag = true;
    }

    setError(null);

    try {
      if (flag) {
        let res = await axios.post(
          "http://localhost:5023/api/v1/auth/login",
          {
            username: myForm.Username,
            password: myForm.password,
          }
        );
        if (res.status === 200) {
          window.localStorage.setItem(
            "userAuth",
            JSON.stringify({
              userData: res.data,
            })
          );
          console.log(res);
          window.location.pathname = "/Home";
        }
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        setError("Username or password is incorrect");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  console.log(Error);

  return (
    <div className="body">
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} alt="AlgorithMat logo" style={{ padding: "16px 0", maxWidth: 140 }} />
        </div>
        <div className="signup-container">
          <h2>Log in to AlgorithMat</h2>
          <p
            style={{
              textAlign: "center",
              marginTop: -6,
              marginBottom: 18,
              color: "#6b7280",
            }}
          >
            Welcome back to AlgorithMat. Continue your problem-solving streak by signing in.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleErrors();
              hanndelSendData();
            }}
          >
            {Error && (
              <p
                className="error"
                role="alert"
                style={{ marginTop: -4, marginBottom: 12 }}
              >
                {Error}
              </p>
            )}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your AlgorithMat username"
              value={myForm.Username}
              onChange={(e) => {
                setMyForm({ ...myForm, Username: e.target.value });
              }}
              required
            />
            {accept && hasSpaceInUsername && (
              <p className="error">Username cannot contain spaces</p>
            )}
            {myForm.Username.length <= 1 && accept && !hasSpaceInUsername && (
              <p className="error">user name must be more than</p>
            )}

            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={myForm.password}
                onChange={(e) =>
                  setMyForm({ ...myForm, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42" />
                    <path d="M16.88 16.88A10.05 10.05 0 0112 19c-4.48 0-8.27-2.94-9.54-7a10.05 10.05 0 012.04-3.37M6.23 6.23A10 10 0 0112 5c4.48 0 8.27 2.94 9.54 7a10.06 10.06 0 01-4.13 5.09" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {Less_8 && accept && (
              <p className="error">Password must be more than 8</p>
            )}

            <button type="submit">Log In</button>

            <div className="login-link">
              Don&apos;t have an account yet?{" "}
              <Link to="/Register">Join AlgorithMat</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
