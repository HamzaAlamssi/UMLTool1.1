import React from "react";
import styles from "./styles/components-styles/Header.module.css";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";


function Header() {
  const { user } = useProjects();
  const navigate = useNavigate();
  // Use a default avatar image
  const avatarUrl = user?.profileImage || "/image/default-avatar.png";
  const displayName = user?.email || user?.username || "Guest";

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
        {/* <img
          src={avatarUrl}
          alt="User Avatar"
          className={styles.userImg}
        /> */}

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
          <img
            src="/image/notifications.png"
            alt="Notifications"
            className={styles.buttonIcon}
          />
        </button>
        <button className={styles.iconButton}>
          <img src="/image/help.png" alt="Help" className={styles.buttonIcon} />
        </button>
      </div>
    </div>
  );
}

export default Header;
