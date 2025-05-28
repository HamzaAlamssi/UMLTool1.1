import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import styles from "../components/styles/user-pages/RecentProjectsPage.module.css";
import { useNavigate } from "react-router-dom";

function SharedWithMePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
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
      )
      .finally(() => setLoading(false));
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
            {loading ? (
              <div>Loading shared projects, please wait...</div>
            ) : error ? (
              <div style={{ color: "red" }}>Oops! Something went wrong: {error}</div>
            ) : projects.length === 0 ? (
              <div>No shared projects found. If you think something should be here, check with your collaborators!</div>
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
