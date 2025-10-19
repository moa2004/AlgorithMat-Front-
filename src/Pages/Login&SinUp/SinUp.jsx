import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import logo from "/src/assets/algorithmat-logo.svg";
import PasswordStrengthMeter from "../../Components/miniComponents/PasswordStrengthMeter";

export default function SignUp() {
  const [myForm, setMyForm] = useState({
    Username: "",
    password: "",
    rPassword: "",
    ProfileImage: null,
  });
  const [accept, setAccept] = useState(false);
  const [Error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleErrors = () => setAccept(true);
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Password validations
  const dontMatch = myForm.password !== myForm.rPassword;
  const Less_8 = myForm.password.length < 8;

  // Username validations
  const usernameTrim = myForm.Username.trim();
  const usernameHasSpace = /\s/.test(myForm.Username);
  const usernameStartsWithNumber = /^\d/.test(usernameTrim);
  const usernameTooShort = usernameTrim.length > 0 && usernameTrim.length < 3;
  const usernameEmpty = usernameTrim.length === 0;
  const usernameInvalid =
    usernameEmpty ||
    usernameTooShort ||
    usernameStartsWithNumber ||
    usernameHasSpace;

  // File required
  const imageMissing = !myForm.ProfileImage;

  // Overall form validity
  const formValid = !Less_8 && !dontMatch && !usernameInvalid && !imageMissing;

  async function handleSendData() {
    if (!formValid) return;

    try {
      const formData = new FormData();
      formData.append("Username", usernameTrim);
      formData.append("Password", myForm.password);
      formData.append("ProfileImage", myForm.ProfileImage);

      const res = await axios.post(
        "http://localhost:5023/api/v1/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "text/plain",
          },
        }
      );

      if (res.status === 200) {
        navigate("/LogIn");
      }
    } catch (err) {
      setError(err.response?.status || "Error");
    }
  }

  return (
    <div className="body">
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} alt="AlgorithMat logo" style={{ padding: "16px 0", maxWidth: 140 }} />
        </div>

        <div className="signup-container">
          <h2>Join AlgorithMat</h2>
          <p
            style={{
              textAlign: "center",
              marginTop: -6,
              marginBottom: 18,
              color: "#6b7280",
            }}
          >
            Create your free account and unlock curated problem sets, instant feedback,
            and a community built around mastering algorithms.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleErrors();
              handleSendData();
            }}
          >
            {/* Username */}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              value={myForm.Username}
              onChange={(e) =>
                setMyForm({
                  ...myForm,
                  Username: e.target.value,
                })
              }
              className={accept && usernameInvalid ? "invalid" : ""}
              aria-invalid={accept && usernameInvalid}
              required
            />
            {accept && usernameEmpty && (
              <p className="error">Username is required</p>
            )}
            {accept && usernameHasSpace && (
              <p className="error">Username cannot contain spaces</p>
            )}
            {accept && usernameTooShort && !usernameHasSpace && (
              <p className="error">Username must be at least 3 characters</p>
            )}
            {accept && usernameStartsWithNumber && !usernameHasSpace && (
              <p className="error">Username cannot start with a number</p>
            )}

            {/* Password */}
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                value={myForm.password}
                onChange={(e) =>
                  setMyForm({ ...myForm, password: e.target.value })
                }
                className={accept && Less_8 ? "invalid" : ""}
                aria-invalid={accept && Less_8}
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="toggle-password"
              >
                {showPassword ? (
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
                    <path
                      d="M16.88 16.88A10.05 10.05 0 0112 19c-4.48 0-8.27-2.94-9.54-7
                 a10.05 10.05 0 012.04-3.37M6.23 6.23A10 10 0 0112 5
                 c4.48 0 8.27 2.94 9.54 7a10.06 10.06 0 01-4.13 5.09"
                    />
                  </svg>
                ) : (
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

            {/* ✅ مكون قوة كلمة المرور */}
            <PasswordStrengthMeter password={myForm.password} />

            {Less_8 && accept && (
              <p className="error">Password must be at least 8 characters</p>
            )}

            {/* Confirm Password */}
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Re-enter your password"
              value={myForm.rPassword}
              onChange={(e) =>
                setMyForm({ ...myForm, rPassword: e.target.value })
              }
              className={accept && dontMatch ? "invalid" : ""}
              aria-invalid={accept && dontMatch}
              required
            />
            {dontMatch && accept && (
              <p className="error">Passwords do not match</p>
            )}

            {/* Profile Image */}
            <label htmlFor="profile-picture">Profile Picture</label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={(e) =>
                setMyForm({ ...myForm, ProfileImage: e.target.files[0] })
              }
              className={accept && imageMissing ? "invalid" : ""}
              aria-invalid={accept && imageMissing}
              required
            />
            {accept && imageMissing && (
              <p className="error">Profile image is required</p>
            )}

            <button type="submit">Create Account</button>

            {Error && <p className="error">Error: {Error}</p>}

            <div className="login-link">
              Already have an account? <Link to="/LogIn">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
