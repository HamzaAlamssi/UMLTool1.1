import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "../components/styles/user-pages/SharedWithMePage.module.css";

function SharedWithMePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:9000/auth/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || err.toString());
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/LogoutSuccess", {
      state: { logoutMessage: "You have successfully logged out" },
    });
  };

  const renderLogoutModal = () => (
    <div className={styles.logoutModalOverlay}>
      <div className={styles.logoutModalContent}>
        <h2 className={styles.modalTitle}>Logout</h2>
        <p className={styles.modalText}>Are you sure you want to log out?</p>
        <div className={styles.logoutModalActions}>
          <button
            className={styles.btnSecondary}
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </button>
          <button className={styles.btnPrimary} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <Sidebar
        activePage="SharedWithMe"
        onLogoutClick={() => setShowLogoutModal(true)}
      />
      <div className={styles.mainContent}>
        <Header user={user} />
        <div className={styles.headerSection}>
          <div className={styles.pageTitleRow}>
            <h1 className={styles.pageTitle}>Shared With Me</h1>
            {/* ...add any action buttons here if needed... */}
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </div>
        {/* Main shared content area */}
        <div className={styles.contentArea}>
          {/* ...shared files/projects/cards go here... */}
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📁</span>
            <p>No files or projects have been shared with you yet.</p>
          </div>
        </div>
      </div>
      {showLogoutModal && renderLogoutModal()}
    </div>
  );
}

export default SharedWithMePage;
