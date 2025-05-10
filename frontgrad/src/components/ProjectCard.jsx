import React from "react";
import styles from "./styles/components-styles/ProjectCard.module.css";
import { FiTrash2 } from "react-icons/fi";

function ProjectCard({ project, onClick, onDelete }) {
  return (
    <div className={styles.projectCard} onClick={() => onClick(project.id)}>
      <div className={styles.cardHeader}>
        <h3 className={styles.projectTitle}>{project.name}</h3>
        <button
          className={styles.deleteBtn}
          title="Delete project"
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm("Are you sure you want to delete this project?")
            ) {
              onDelete && onDelete(project.id);
            }
          }}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
      <div className={styles.projectInfo}>
        <div>Type: {project.diagramType}</div>
        <div>Owner: {project.ownerUsername}</div>
        <div>Created: {project.createdAt?.slice(0, 10)}</div>
      </div>
    </div>
  );
}

export default ProjectCard;
