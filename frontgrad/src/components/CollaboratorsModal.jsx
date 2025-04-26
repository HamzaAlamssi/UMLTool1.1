import React, { useState } from "react";
import styles from "./styles/components-styles/CollaboratorsModal.module.css";

const initialCollaborators = [
  {
    name: "Esraa Alhariri",
    avatar: "https://i.pravatar.cc/48?u=user1",
    role: "Owner",
    canEdit: false,
    fallback: null,
  },
  {
    name: "Mohammed Beso",
    avatar: "https://i.pravatar.cc/48?u=user2",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Yaqeen Khazaleh",
    avatar: "https://i.pravatar.cc/48?u=user3",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Sara Ahmad",
    avatar: "https://i.pravatar.cc/48?u=user4",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Omar Khaled",
    avatar: "https://i.pravatar.cc/48?u=user5",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Lina Fares",
    avatar: "https://i.pravatar.cc/48?u=user6",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Ali Nasser",
    avatar: "https://i.pravatar.cc/48?u=user7",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Huda Samir",
    avatar: "https://i.pravatar.cc/48?u=user8",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Rami Zidan",
    avatar: "https://i.pravatar.cc/48?u=user9",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Mona Tarek",
    avatar: "https://i.pravatar.cc/48?u=user10",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Fadi Jaber",
    avatar: "https://i.pravatar.cc/48?u=user11",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Nour Hassan",
    avatar: "https://i.pravatar.cc/48?u=user12",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Salma Odeh",
    avatar: "https://i.pravatar.cc/48?u=user13",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Tariq Suleiman",
    avatar: "https://i.pravatar.cc/48?u=user14",
    role: null,
    canEdit: true,
    fallback: null,
  },
  {
    name: "Dana Qasem",
    avatar: "https://i.pravatar.cc/48?u=user15",
    role: null,
    canEdit: true,
    fallback: null,
  },
];

function CollaboratorsModal({ open, onClose, onAdd }) {
  const [collaborators, setCollaborators] = useState(initialCollaborators);

  const handleRemove = (name) => {
    setCollaborators((prev) => prev.filter((c) => c.name !== name));
  };

  if (!open) return null;

  // Debug: log collaborators to ensure all are present
  console.log(collaborators);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal header with close button on the right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className={styles.groupName}>Group Name Placeholder</h1>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            style={{ alignSelf: "flex-start" }}
          >
            ×
          </button>
        </div>
        <h2 className={styles.title}>Manage Project Collaborators</h2>
        {/* Scrollable collaborators list */}
        <div className={styles.collaboratorsList}>
          {collaborators.map((c) => (
            <div className={styles.collaborator} key={c.name}>
              {c.avatar ? (
                <img className={styles.avatar} src={c.avatar} alt="Avatar" />
              ) : (
                <div className={`${styles.avatar} ${styles.fallback}`}>
                  {c.fallback}
                </div>
              )}
              <span className={styles.name}>{c.name}</span>
              {c.role ? (
                <span className={styles.role}>{c.role}</span>
              ) : (
                <>
                  <select className={styles.select} defaultValue="edit">
                    <option value="edit">Edit and share</option>
                    <option value="view">View only</option>
                  </select>
                  <button
                    className={styles.removeBtn}
                    title="Remove"
                    onClick={() => handleRemove(c.name)}
                    style={{ marginLeft: 8 }}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className={styles.footerButtons}>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              if (onAdd) onAdd();
            }}
          >
            Add
          </button>
          <button className={styles.primaryBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollaboratorsModal;
