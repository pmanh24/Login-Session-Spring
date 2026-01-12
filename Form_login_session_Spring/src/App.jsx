import React, { useState, useEffect, useRef } from "react";
import "./Styles.css";
import axios from "./config/axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cardRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  /* ---------- EFFECT UI ---------- */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current || isSuccess) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const angleX = (x - centerX) / centerX;
      const angleY = (y - centerY) / centerY;

      const shadowX = angleX * 30;
      const shadowY = angleY * 30;

      cardRef.current.style.boxShadow = `
        ${shadowX}px ${shadowY}px 60px #bec3cf,
        ${-shadowX}px ${-shadowY}px 60px #ffffff
      `;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isSuccess]);

  /* ---------- VALIDATE ---------- */
  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const handleLogout = async () => {
    setUsername("")
    setPassword("")
    try {
      await axios.post("/logout");
      setIsSuccess(false)
    } catch (error) {}
  };
  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    console.log(username);
    
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      await axios.post("/login", params);
      setIsSuccess(true);
      setTimeout(() => {
        // window.location.href = "/dashboard";
      }, 1200);
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        @keyframes gentleShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        @keyframes successPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .error input { animation: gentleShake 0.5s ease-in-out; }
      `}</style>

      <div
        className={`login-card ${isSuccess ? "success-mode" : ""}`}
        ref={cardRef}
      >
        {!isSuccess ? (
          <>
            <div className="login-header">
              <div className="neu-icon">
                <div className="icon-inner">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <h2>Welcome back</h2>
              <p>Please sign in to continue</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* USERNAME */}
              <div className={`form-group ${errors.username ? "error" : ""}`}>
                <div className="input-group neu-input" ref={usernameInputRef}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors({ ...errors, username: "" });
                    }}
                    placeholder=" "
                    required
                  />
                  <label>Username</label>
                </div>
                {errors.username && (
                  <span className="error-message show">{errors.username}</span>
                )}
              </div>

              {/* PASSWORD */}
              <div className={`form-group ${errors.password ? "error" : ""}`}>
                <div
                  className="input-group neu-input password-group"
                  ref={passwordInputRef}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: "" });
                    }}
                    placeholder=" "
                    required
                  />
                  <label>Password</label>

                  <button
                    type="button"
                    className="password-toggle neu-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message show">{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                className={`neu-button login-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </>
        ) : (
          <div
            className="success-message show"
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <div
              className="success-icon neu-icon"
              style={{ animation: "successPulse 0.6s ease-out" }}
            >
              ✓
            </div>
            <h3>Login success</h3>
            <p>Hello : {username}</p>
            <button
              className="neu-button login-btn"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
