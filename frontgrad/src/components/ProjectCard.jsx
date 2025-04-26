import React from "react";
import styles from "./styles/components-styles/ProjectCard.module.css";

function ProjectCard({ project, onClick, onDelete }) {
  return (
    <div className={styles.projectCard} onClick={() => onClick(project.id)}>
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("Are you sure you want to delete this project?")) {
            onDelete && onDelete(project.id);
          }
        }}
        style={{
          position: "absolute",
          top: 8,
          right: 12,
          background: "none",
          border: "none",
          color: "#d32f2f",
          fontWeight: "bold",
          fontSize: "1.2rem",
          cursor: "pointer",
          zIndex: 2,
        }}
        title="Delete project"
      >
        ×
      </button>
      <h3>{project.name}</h3>
      <div>Type: {project.diagramType}</div>
      <div>Owner: {project.ownerUsername}</div>
      <div>Created: {project.createdAt?.slice(0, 10)}</div>
    </div>
  );
}

export default ProjectCard;
