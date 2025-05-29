import React from "react";
import styles from "./styles/user-pages/TemplatesPage.module.css";
import { useNavigate } from "react-router-dom";

function TemplateCard({ template }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Get current user info
      const userRes = await fetch("http://localhost:9000/auth/aUser", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!userRes.ok) throw new Error("Not authenticated");
      const userData = await userRes.json();
      const email = userData.username;

      // Create project from template
      const res = await fetch(
        `http://localhost:9000/api/templates/${template.id}/create-project?projectName=${encodeURIComponent(template.name)}&ownerEmail=${encodeURIComponent(email)}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to create project from template");
      const project = await res.json();
      navigate(`/project/${project.id}`);
    } catch (err) {
      alert(err.message || "Failed to create project from template");
    }
  };

  return (
    <div className={styles.templateCard} onClick={handleClick} style={{ cursor: "pointer" }}>
      <h3>{template.name}</h3>
      {template.type && (
        <div>
          <span className={styles.templateType}>{template.type}</span>
        </div>
      )}
    </div>
  );
}

export default TemplateCard;
