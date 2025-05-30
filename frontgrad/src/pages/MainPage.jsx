import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/MainPage.module.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import WhiteboardModal from "../components/WhiteboardModal";
import TemplateCard from "../components/TemplateCard";
import ProjectCard from "../components/ProjectCard";
import { FiPlus } from "react-icons/fi";
import { useProjects } from "../context/ProjectContext";

function MainPage() {
  const { user, projects, templates, error, createProject } = useProjects();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [previousActiveLink, setPreviousActiveLink] = React.useState(null);
  const [showWhiteboardModal, setShowWhiteboardModal] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState("");
  const navigate = useNavigate();

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

  const handleBlankCardClick = () => {
    setShowWhiteboardModal(true);
    setProjectName("");
    setModalError("");
  };

  const handleWhiteboardModalClose = () => {
    setShowWhiteboardModal(false);
    setProjectName("");
    setModalError("");
  };

  const handleWhiteboardModalSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    try {
      const data = await createProject(projectName);
      setModalLoading(false);
      setShowWhiteboardModal(false);
      navigate(`/project/${data.id}`);
    } catch (err) {
      setModalLoading(false);
      setModalError(err.message || err.toString());
    }
  };

  // Sort and slice for display
  const sortedTemplates = [...(templates || [])]
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);
  const sortedProjects = [...(projects || [])]
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 4);

  return (
    <div className={styles.mainPage}>
      <Header />
      <Sidebar onLogout={handleLogOutClick} />
      <div className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <h1>Welcome, {user ? user.username : "Guest"}!</h1>
          {error && <p className={styles.error}>{error}</p>}
        </header>
        <h2 className={styles.fixedTitle}>Start a New Project</h2>
        <div className={styles.templates}>
          <div
            className={styles.templateCard}
            onClick={handleBlankCardClick}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "#348983", border: "2px dashed #b2dfdb", background: "#e6f2f1", cursor: "pointer" }}
            title="Start from blank"
          >
            <FiPlus size={38} style={{ marginBottom: 8 }} />
            <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Blank Project</span>
          </div>
          {sortedTemplates.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} />
          ))}
        </div>
        <h2 className={styles.fixedTitle} style={{ marginTop: "2.2rem" }}>Recent Projects</h2>
        <div className={styles.cardsContainer}>
          {sortedProjects.length === 0 ? (
            <div>No recent projects found.</div>
          ) : (
            sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/project/${project.id}`)}
                showDelete={false}
              />
            ))
          )}
        </div>
      </div>
      <div className={styles.bottomRectangle}></div>
      <WhiteboardModal
        open={showWhiteboardModal}
        onClose={handleWhiteboardModalClose}
        projectName={projectName}
        setProjectName={setProjectName}
        loading={modalLoading}
        error={modalError}
        onSubmit={handleWhiteboardModalSubmit}
      />
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
