import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Initialize from localStorage immediately
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  // ✅ LOGIN
  const login = (userData) => {
    if (!userData || !userData.token) {
    toast.error("Invalid login data");
    return;
  }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
    navigate("/"); // optional redirect
  };

  /**
   * 🔐 Require login for actions (NOT pages)
   * Use only inside click handlers
   */
  const requireAuth = (actionName = "perform this action") => {
    if (!isAuthenticated) {
      toast.warning(`Please login first to ${actionName}`);
      navigate("/login"); // redirect to login page
      return false;
    }
    return true;
  };
  const updateUser = (updatedData) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev,
        ...updatedData,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        requireAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
