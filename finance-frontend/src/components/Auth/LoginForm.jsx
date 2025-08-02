import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const illustrationLight = "/login-light.png";
const illustrationDark = "/login-dark.png";

const LoginPage = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  useEffect(() => {
    document.body.style.background = isDark ? "#121212" : "#f4f6f9";
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description:
          result.error || "Please check your credentials and try again.",
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
      className="login-page"
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
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10 }}>
        <button
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          style={{
            fontSize: 24,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: isDark ? "#a0e8af" : "#2a6333",
          }}
        >
          {isDark ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
      </div>

      {/* Illustration */}
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
          style={{ width: "90%", maxWidth: 500, objectFit: "contain" }}
        />
      </div>

      {/* Login Form */}
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
          onSubmit={handleLogin}
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
              color: isDark ? "#fefefe" : "#212121",
            }}
          >
            Welcome Back 👋
          </h1>
          <p
            style={{
              marginBottom: 32,
              color: isDark ? "#bdbdbd" : "#4f4f4f",
              fontSize: 15,
            }}
          >
            Login to your <strong>Finance Manager</strong> account to track
            income & expenses.
          </p>

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

          <div style={{ marginBottom: 28 }}>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: isDark ? "#bbbbbb" : "#444",
              marginTop: 20,
            }}
          >
            Don’t have an account?{" "}
            <a
              href="/signup"
              style={{
                color: isDark ? "#90ee90" : "#1976d2",
                textDecoration: "underline",
              }}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .login-page {
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

export default LoginPage;
