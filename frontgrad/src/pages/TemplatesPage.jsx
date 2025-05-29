import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/TemplatesPage.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TemplateCard from "../components/TemplateCard";
import { useProjects } from "../context/ProjectContext";

function TemplatesPage() {
  const { templates, error } = useProjects();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [previousActiveLink, setPreviousActiveLink] = React.useState(null);
  const navigate = useNavigate();

  const handleLogOutClick = () => {
    const active = document.querySelector(".link-list a.active");
    if (active && !active.classList.contains("logout")) {
      setPreviousActiveLink(active);
    }
    setShowLogoutModal(true);
  };

  const designPatternTemplates = (templates || []).filter(t => t.type === "design pattern");
  const customizedTemplates = (templates || []).filter(t => t.type === "customized");

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.layout}>
        <Sidebar onLogout={handleLogOutClick} />
        <main className={styles.mainContent}>
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Find Your Perfect Template</h1>
            <p className={styles.heroDesc}>Browse ready-made design patterns or start from your own customized templates. Click any card to start a new project instantly!</p>
          </section>
          <div className={styles.underline} />
          {error && <p className={styles.error}>{error}</p>}
          <section className={styles.section}>
            <h3 className={styles.fixedTitle}>Design Pattern Templates</h3>
            <div className={styles.cardsContainer}>
              {designPatternTemplates.length === 0 && <div>No design pattern templates found.</div>}
              {designPatternTemplates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          </section>
          <section className={styles.section}>
            <h3 className={styles.fixedTitle}>Your Templates</h3>
            <div className={styles.cardsContainer}>
              {customizedTemplates.length === 0 && <div>No customized templates found.</div>}
              {customizedTemplates.map((tpl) => (
                <TemplateCard key={tpl.id} template={{...tpl, type: undefined}} />
              ))}
            </div>
          </section>
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
