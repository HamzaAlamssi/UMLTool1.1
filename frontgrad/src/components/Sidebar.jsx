import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./styles/components-styles/Sidebar.module.css";
import NewDropdown from "./NewDropdown";
import { FiHome, FiClock, FiLayers, FiUsers, FiLogOut } from "react-icons/fi";
import { useProjects } from "../context/ProjectContext";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const { refresh } = useProjects();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    // Call backend logout endpoint if available
    try {
      await fetch("http://localhost:9000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignore errors, just proceed
    }
    // Optionally clear user state
    if (typeof refresh === "function") refresh();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.navSection}>
        <NewDropdown />
        <div className={styles.linkList}>
          <NavLink
            to="/main"
            style={{ color: "black" }}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiHome size={22} color="black" />
            Home
          </NavLink>
          <NavLink
            to="/recentProjects"
            style={{ color: "black" }}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiClock size={22} color="black" />
            Recent
          </NavLink>
        </div>
        <div className={styles.sectionTitle} style={{ color: "black" }}>
          Discover
        </div>
        <div className={styles.linkList}>
          <NavLink
            to="/Templates"
            style={{ color: "black" }}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiLayers size={22} color="black" />
            Templates
          </NavLink>
          <NavLink
            to="/SharedWithMe"
            style={{ color: "black" }}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiUsers size={22} color="black" />
            Shared with me
          </NavLink>
        </div>
      </nav>
      <button
        className={styles.logout}
        style={{ color: "black" }}
        onClick={handleLogout}
      >
        <FiLogOut size={22} color="black" />
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
