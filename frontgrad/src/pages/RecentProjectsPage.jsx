import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import styles from "../components/styles/user-pages/RecentProjectsPage.module.css";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";

function RecentProjectsPage() {
  const { projects, error, deleteProject, updateProjectName } = useProjects();
  const navigate = useNavigate();

  const handleCardClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // Sort by updatedAt/createdAt desc
  const sortedProjects = [...(projects || [])]
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h2 className={styles.title}>Recent Projects</h2>
          <div className={styles.underline} />
          <div className={styles.cardsContainer}>
            {error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : sortedProjects.length === 0 ? (
              <div>No projects found.</div>
            ) : (
              sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleCardClick}
                  onDelete={deleteProject}
                  showDelete={true}
                  onUpdateName={updateProjectName}
                  showMore={true}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default RecentProjectsPage;
