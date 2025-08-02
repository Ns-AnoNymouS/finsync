import React, { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const illustrationLight = "/signup-light.png";
const illustrationDark = "/signup-dark.png";

const SignupPage = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    const result = await register({
      name,
      email,
      password,
    });

    if (result.success) {
      toast({
        title: "Account created!",
        description:
          "Welcome to Finance Assistant. Your account has been created successfully.",
      });
      navigate("/");
    } else {
      toast({
        title: "Registration failed",
        description:
          result.error || "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const commonInputStyles = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: isDark ? "1px solid #3c4a3e" : "1px solid #d4e5d4",
    background: isDark ? "#2f3740" : "#f8f9fa",
    color: isDark ? "#f1f1f1" : "#222",
    fontSize: 15,
    marginTop: 6,
    transition: "all 0.3s ease",
  };

  const googleButtonStyles = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px",
    backgroundColor: isDark ? "#2e2e2e" : "#fff",
    border: isDark ? "1px solid #444" : "1px solid #ccc",
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    color: isDark ? "#e0e0e0" : "#333",
    transition: "background 0.3s ease",
  };

  return (
    <div
      className="signup-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        fontFamily: `'Segoe UI', Roboto, sans-serif`,
        background: isDark ? "#121212" : "#f4f6f9",
        color: isDark ? "#f1f1f1" : "#111",
        transition: "0.3s",
        position: "relative",
        flexWrap: "wrap",
      }}
    >
      {/* Theme Toggle */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <button
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          style={{
            fontSize: 24,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: isDark ? "#a0e8af" : "#1e88e5",
          }}
        >
          {isDark ? (
            <FiMoon size={20} color="#e3f2fd" />
          ) : (
            <FiSun size={20} color="#006400" />
          )}
        </button>
      </div>

      {/* Right Illustration */}
      <div
        className="illustration-container"
        style={{
          flex: 1,
          background: isDark ? "#202830" : "#eaf4ea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          order: 1,
        }}
      >
        <img
          src={isDark ? illustrationDark : illustrationLight}
          alt="Finance Illustration"
          style={{
            width: "90%",
            maxWidth: 500,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Left Form */}
      <div
        className="form-container"
        style={{
          flex: 1,
          padding: "50px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
          order: 2,
        }}
      >
        <form
          onSubmit={handleSignup}
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: "-0.5px",
              color: isDark ? "#fefefe" : "#212121",
            }}
          >
            Join Us 🎉
          </h1>
          <p
            style={{
              marginBottom: 32,
              color: isDark ? "#bdbdbd" : "#4f4f4f",
              fontSize: 15,
            }}
          >
            Create your <strong>Finance Manager</strong> account to start
            managing your money better.
          </p>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>
              Full Name
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={commonInputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>
              Email Address
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={commonInputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>
              Password
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={commonInputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>
              Confirm Password
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={commonInputStyles}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading
                ? isDark
                  ? "#2a6333"
                  : "#51905c"
                : isDark
                ? "#43a047"
                : "#2e7d32",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 8,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "3px solid #fff",
                  borderTop: "3px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : null}
            {loading ? "Signing up..." : "Create  Account"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: isDark ? "#bbbbbb" : "#444",
              marginTop: 20,
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: isDark ? "#90ee90" : "#1976d2",
                textDecoration: "underline",
              }}
            >
              Log in
            </a>
          </p>
        </form>
      </div>

      {/* Mobile Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .signup-page {
            flex-direction: column !important;
          }
          .illustration-container {
            order: 1;
            padding: 30px 20px;
          }
          .form-container {
            order: 2;
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
