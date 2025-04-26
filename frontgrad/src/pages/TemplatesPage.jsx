import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/TemplatesPage.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function TemplatesPage() {
  const [setUser] = useState(null);
  const [error, setError] = useState("");
  const [activePopup, setActivePopup] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [previousActiveLink, setPreviousActiveLink] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/auth/me", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Not authenticated"))
      )
      .then((data) => setUser(data))
      .catch((err) => setError(err.message || err.toString()));
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/LogoutSuccess", {
      state: { logoutMessage: "You have successfully logged out" },
    });
  };

  const handlePopupClick = (popupType) => {
    setActivePopup(popupType);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  // Handles logout link click, sets previous active link for restoration
  const handleLogOutClick = () => {
    const active = document.querySelector(".link-list a.active");
    if (active && !active.classList.contains("logout")) {
      setPreviousActiveLink(active);
    }
    setShowLogoutModal(true);
  };

  // Handles sidebar link active state
  useEffect(() => {
    const navLinks = document.querySelectorAll(".link-list a");
    const handleLinkClick = function () {
      if (
        !this.classList.contains("new") &&
        !this.classList.contains("logout")
      ) {
        navLinks.forEach((link) => {
          if (!link.classList.contains("logout"))
            link.classList.remove("active");
        });
        this.classList.add("active");
      }
    };
    navLinks.forEach((link) => link.addEventListener("click", handleLinkClick));
    return () => {
      navLinks.forEach((link) =>
        link.removeEventListener("click", handleLinkClick)
      );
    };
  }, []);

  // Template and pattern data for rendering
  const customTemplates = [
    {
      title: "Activity diagram",
      img: "/image/Activity diagram.png",
      alt: "Activity Diagram",
    },
    {
      title: "Class diagram",
      img: "/image/class diagram.png",
      alt: "Class Diagram",
    },
    {
      title: "Component diagram",
      img: "/image/Component diagram template.png",
      alt: "Component Diagram",
    },
  ];

  const patternTemplates = [
    {
      title: "Adapter pattern",
      img: "/image/Adapter pattern.png",
      alt: "Adapter Pattern",
    },
    {
      title: "MVC pattern",
      img: "/image/MVC pattern.png",
      alt: "MVC Pattern",
    },
    {
      title: "Singleton pattern",
      img: "/image/Singleton pattern.png",
      alt: "Singleton Pattern",
    },
  ];

  return (
    <div className={styles.templatesPage}>
      <Header />
      <Sidebar onLogout={handleLogOutClick} />
      <div className={styles.mainContent}>
        {error && <p className={styles.error}>{error}</p>}
        <h2 className={styles.fixedTitle}>Custom Styled Templates</h2>
        <div className={styles.templates}>
          {customTemplates.map((tpl) => (
            <div className={styles.templateCard} key={tpl.title}>
              <h3>{tpl.title}</h3>
              <img src={tpl.img} alt={tpl.alt} />
            </div>
          ))}
          <div
            className={`${styles.templateCard} ${styles.moreTemplates}`}
            onClick={() => handlePopupClick("Custom Styled Templates")}
          >
            <div className={styles.customTemplateContent}>
              <img src="/image/template.png" alt="More Templates" />
              <h3>More Templates</h3>
            </div>
          </div>
        </div>
        <div className={styles.recentProjects}>Pattern Templates</div>
        <div className={styles.patternTemplatesGrid}>
          {patternTemplates.map((tpl) => (
            <div className={styles.patternTemplateItem} key={tpl.title}>
              <h3>{tpl.title}</h3>
              <img src={tpl.img} alt={tpl.alt} />
            </div>
          ))}
          <div
            className={`${styles.patternTemplateItem} ${styles.moreTemplates}`}
            onClick={() => handlePopupClick("Pattern Templates")}
          >
            <div className={styles.patternTemplateContent}>
              <img src="/image/template.png" alt="More Templates" />
              <h3>More Templates</h3>
            </div>
          </div>
        </div>
        {/* Popups */}
        {["Custom Styled Templates", "Pattern Templates"].includes(
          activePopup
        ) && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <h2>{activePopup}</h2>
              {activePopup === "Custom Styled Templates" && (
                <div className={styles.buttonsContainer}>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Use Case Diagram clicked!")}
                  >
                    <h3>Use Case Diagram</h3>
                    <img
                      src="/image/Use%20Case%20Diagram.png"
                      alt="Use Case Diagram"
                    />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Sequence Diagram clicked!")}
                  >
                    <h3>Sequence Diagram</h3>
                    <img
                      src="/image/Sequence%20Diagram.png"
                      alt="Sequence Diagram"
                    />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Activity Diagram clicked!")}
                  >
                    <h3>Activity Diagram</h3>
                    <img
                      src="/image/Activity diagram.png"
                      alt="Activity Diagram"
                    />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Class Diagram clicked!")}
                  >
                    <h3>Class Diagram</h3>
                    <img src="/image/class diagram.png" alt="Class Diagram" />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Component Diagram clicked!")}
                  >
                    <h3>Component Diagram</h3>
                    <img
                      src="/image/Component diagram template.png"
                      alt="Component Diagram"
                    />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Deployment Diagram clicked!")}
                  >
                    <h3>Deployment Diagram</h3>
                    <img
                      src="/image/deployment diagram template.png"
                      alt="Deployment Diagram"
                    />
                  </div>
                </div>
              )}
              {activePopup === "Pattern Templates" && (
                <div className={styles.buttonsContainer}>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Adapter Pattern clicked!")}
                  >
                    <h3>Adapter pattern</h3>
                    <img
                      src="/image/Adapter pattern.png"
                      alt="Adapter Pattern"
                    />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("MVC Pattern clicked!")}
                  >
                    <h3>MVC pattern</h3>
                    <img src="/image/MVC pattern.png" alt="MVC Pattern" />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Singleton Pattern clicked!")}
                  >
                    <h3>Singleton pattern</h3>
                    <img
                      src="/image/Singleton pattern.png"
                      alt="Singleton Pattern"
                    />
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Button 4 clicked!")}
                  >
                    <h3>Button 4</h3>
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Button 5 clicked!")}
                  >
                    <h3>Button 5</h3>
                  </div>
                  <div
                    className={styles.templateCard}
                    onClick={() => alert("Button 6 clicked!")}
                  >
                    <h3>Button 6</h3>
                  </div>
                </div>
              )}
              <button onClick={closePopup} aria-label="Close popup">
                ×
              </button>
            </div>
          </div>
        )}
        {/* Logout Modal */}
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
    </div>
  );
}

export default TemplatesPage;
