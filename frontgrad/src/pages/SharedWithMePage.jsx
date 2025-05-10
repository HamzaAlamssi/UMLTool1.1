import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import styles from "../components/styles/user-pages/RecentProjectsPage.module.css";
import { useNavigate } from "react-router-dom";

function SharedWithMePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/auth/aUser", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Not authenticated"))
      )
      .then((userData) => {
        const email = userData.email || userData.username;
        return fetch(
          `http://localhost:9000/api/projects/shared?email=${encodeURIComponent(
            email
          )}`,
          { credentials: "include" }
        );
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shared projects");
        return res.json();
      })
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) =>
        setError(err.message || "Failed to fetch shared projects")
      );
  }, []);

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
            ) : projects.length === 0 ? (
              <div>No shared projects found.</div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleCardClick}
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
