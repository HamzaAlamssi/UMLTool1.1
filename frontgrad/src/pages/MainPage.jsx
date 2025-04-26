import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/MainPage.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function MainPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [previousActiveLink, setPreviousActiveLink] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Not authenticated");
        }
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/LogoutSuccess", {
      state: { logoutMessage: "You have successfully logged out" },
    });
  };

  const handleLogOutClick = () => {
    const active = document.querySelector(".link-list a.active");
    if (active && !active.classList.contains("logout")) {
      setPreviousActiveLink(active);
    }
    const logoutLink = document.querySelector(".link-list a.logout");
    if (logoutLink) logoutLink.classList.remove("active");
    setShowLogoutModal(true);
  };

  return (
    <div className={styles.mainPage}>
      <Header />
      <Sidebar onLogout={handleLogOutClick} />
      <div className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <h1>Welcome, {user ? user.username : "Guest"}!</h1>
          {error && <p className={styles.error}>{error}</p>}
        </header>
        <h2 className={styles.fixedTitle}>Dive into our new templates</h2>
        <div className={styles.templates}>
          <div
            className={styles.templateCard}
            onClick={() => alert("Blank template selected!")}
          >
            <h3>Blank</h3>
            <img src="/image/Blank.png" alt="Blank Template" />
          </div>
          <div
            className={styles.templateCard}
            onClick={() => alert("Sequence diagram selected!")}
          >
            <h3>Sequence Diagram</h3>
            <img src="/image/Sequence%20Diagram.png" alt="Sequence Diagram" />
          </div>
          <div
            className={styles.templateCard}
            onClick={() => alert("Use Case diagram selected!")}
          >
            <h3>Use Case Diagram</h3>
            <img src="/image/Use%20Case%20Diagram.png" alt="Use Case Diagram" />
          </div>
        </div>
        <div className={styles.recentProjects}>Recent Projects</div>
      </div>
      <div className={styles.bottomRectangle}></div>
      {showLogoutModal && (
        <div className={styles.logoutModalOverlay}>
          <div className={styles.logoutModalContent}>
            <h2>Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className={styles.logoutModalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => {
                  setShowLogoutModal(false);
                  if (previousActiveLink) {
                    document
                      .querySelectorAll(".link-list a")
                      .forEach((link) => {
                        if (!link.classList.contains("logout")) {
                          link.classList.remove("active");
                        }
                      });
                    previousActiveLink.classList.add("active");
                  }
                }}
              >
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
