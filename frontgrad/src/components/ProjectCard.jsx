import React, { useState } from "react";
import styles from "./styles/components-styles/ProjectCard.module.css";
import { FiTrash2 } from "react-icons/fi";
import { FiMoreVertical } from "react-icons/fi";

function ProjectCard({ project, onClick, onDelete, showDelete = true, owner, onUpdateName, showMore}) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateName = async (e) => {
    e.stopPropagation();
    setUpdating(true);
    setError("");
    try {
      await onUpdateName(project.id, newName);
      setShowModal(false);
    } catch (err) {
      setError(err.message || "Failed to update name");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={styles.projectCard} onClick={() => onClick(project.id)}>
      <div className={styles.cardHeader}>
        <h3 className={styles.projectTitle}>{project.name}</h3>
        {showDelete && onDelete && (
          <button
            className={styles.deleteBtn}
            title="Delete project"
            onClick={e => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this project?")) {
                onDelete(project.id);
              }
            }}
          >
            <FiTrash2 size={20} />
          </button>
        )}
        {showMore && (
          <button
            className={styles.moreBtn}
            title="More actions"
            onClick={e => {
              e.stopPropagation();
              setShowModal(true);
              setNewName(project.name);
            }}
          >
            <FiMoreVertical size={20} />
          </button>
        )}
      </div>
      {owner && (
        <div className={styles.ownerName}>Owner: {owner}</div>
      )}
      {showModal && (
        <div className={styles.modalOverlay} onClick={e => { e.stopPropagation(); setShowModal(false); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h4>Rename Project</h4>
            <input
              className={styles.input}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              disabled={updating}
              autoFocus
            />
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} disabled={updating}>Cancel</button>
              <button onClick={handleUpdateName} disabled={updating || !newName.trim()}>
                {updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
