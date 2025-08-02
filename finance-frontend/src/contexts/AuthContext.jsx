import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Auth context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: JSON.parse(user),
          token,
        },
      });
    } else {
      dispatch({ type: "LOGIN_FAILURE", payload: null });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      const { user, tokens } = response.data;

      // ✅ Store token and user in localStorage
      localStorage.setItem("token", tokens.access.token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token: tokens.access.token },
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      // If API returns tokens and user directly
      const { user, tokens } = response.data;

      // Save token and user to localStorage (only if available)
      if (tokens && tokens.access?.token) {
        localStorage.setItem("token", tokens.access.token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: tokens.access.token },
        });

        return { success: true };
      }

      // If no token returned, just inform user
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Registration successful.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
