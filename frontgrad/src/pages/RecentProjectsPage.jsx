import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import styles from "../components/styles/user-pages/RecentProjectsPage.module.css";
import { useNavigate } from "react-router-dom";

// Simple ProjectCard component
function RecentProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username") || "mo";
    fetch(
      `http://localhost:9000/api/projects/own?username=${encodeURIComponent(
        username
      )}`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to fetch projects"));
  }, []);

  const handleCardClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = (projectId) => {
    fetch(`http://localhost:9000/api/projects/${projectId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete project");
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      })
      .catch((err) => setError(err.message || "Failed to delete project"));
  };

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
            ) : projects.length === 0 ? (
              <div>No projects found.</div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleCardClick}
                  onDelete={handleDeleteProject}
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
