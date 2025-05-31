import React from "react";
import styles from "./styles/components-styles/Header.module.css";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiSun, FiMoon, FiHelpCircle } from "react-icons/fi";
import { useState, useEffect } from "react";


function Header() {
  const { user } = useProjects();
  const navigate = useNavigate();
  // Use a default avatar image
  const avatarUrl = user?.profileImage || "/image/default-avatar.png";
  const displayName = user?.email || user?.username || "Guest";

  // Night mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Try to read from localStorage or default to false
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={styles.header}>
      <div className={styles.logoSearch}>
        <img src="/image/logo.png" className={styles.logo} alt="Logo" />
      </div>
      <div
        className={styles.centerUserInfo}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/profile")}
        title="View Profile"
      >
          {user?.profileImage ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className={styles.userImg}
            />
          ) : (
            <FiUser size={22} color="#348983" />
          )}
        <span className={styles.userEmail}>{displayName}</span>
      </div>
      <div className={styles.headerButtons}>
        <button className={styles.iconButton}>
          <FiHelpCircle size={22} color="#348983" />
        </button>
      </div>
    </div>
  );
}

export default Header;
