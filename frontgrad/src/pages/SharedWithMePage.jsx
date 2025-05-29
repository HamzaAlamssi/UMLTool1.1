import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import styles from "../components/styles/user-pages/RecentProjectsPage.module.css";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";

function SharedWithMePage() {
  const { sharedProjects, error } = useProjects();
  const navigate = useNavigate();

  const handleCardClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h2 className={styles.title}>Shared With Me</h2>
          <div className={styles.underline} />
          <div className={styles.cardsContainer}>
            {error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : sharedProjects.length === 0 ? (
              <div>No shared projects found.</div>
            ) : (
              sharedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleCardClick}
                  showDelete={false}
                  owner={project.ownerUsername}
                  showMore={false}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SharedWithMePage;
