import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/TemplatesPage.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TemplateCard from "../components/TemplateCard";

function TemplatesPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [previousActiveLink, setPreviousActiveLink] = useState(null);
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/auth/aUser", {
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

  useEffect(() => {
    fetch("http://localhost:9000/api/templates", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch templates")))
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || err.toString()));
  }, []);

  const handleLogOutClick = () => {
    const active = document.querySelector(".link-list a.active");
    if (active && !active.classList.contains("logout")) {
      setPreviousActiveLink(active);
    }
    setShowLogoutModal(true);
  };

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

  const designPatternTemplates = templates.filter(t => t.type === "design pattern");
  const customizedTemplates = templates.filter(t => t.type === "customized");

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.layout}>
        <Sidebar onLogout={handleLogOutClick} />
        <main className={styles.mainContent}>
          <h2 className={styles.title}>Templates</h2>
          <div className={styles.underline} />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.section}>
            <h3 className={styles.fixedTitle}>Design Pattern Templates</h3>
            <div className={styles.cardsContainer}>
              {designPatternTemplates.length === 0 && <div>No design pattern templates found.</div>}
              {designPatternTemplates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          </div>
          <div className={styles.section}>
            <h3 className={styles.fixedTitle}>Customized Templates</h3>
            <div className={styles.cardsContainer}>
              {customizedTemplates.length === 0 && <div>No customized templates found.</div>}
              {customizedTemplates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          </div>
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
                  <button className={styles.btnPrimary} onClick={() => {
                    setShowLogoutModal(false);
                    navigate("/LogoutSuccess", {
                      state: { logoutMessage: "You have successfully logged out" },
                    });
                  }}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default TemplatesPage;
