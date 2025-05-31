import React, { useState } from "react";
import styles from "./styles/components-styles/ShareModal.module.css";
import { useProjectGroup } from "../context/ProjectGroupContext";
import { useProjects } from "../context/ProjectContext";

function ShareModal({ open, onClose, onManageCollaborators, projectId }) {
  const [groupName, setGroupName] = useState("");
  const [permission, setPermission] = useState("editor");
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [cursorColor, setCursorColor] = useState("#ff00ff");
  const { createGroup, loading, error } = useProjectGroup();
  const { user } = useProjects();

  if (!open) return null;

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (!collaboratorEmail.trim()) return;
    if (user && collaboratorEmail.trim().toLowerCase() === user.email?.toLowerCase()) {
      alert("You cannot add yourself as a collaborator.");
      return;
    }
    if (!collaborators.includes(collaboratorEmail.trim())) {
      setCollaborators([...collaborators, collaboratorEmail.trim()]);
      setCollaboratorEmail("");
    }
  };

  const handleRemoveCollaborator = (email) => {
    setCollaborators(collaborators.filter((c) => c !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || collaborators.length === 0) {
      alert("Please enter a group name and at least one collaborator.");
      return;
    }
    if (!projectId) {
      alert("Project ID not found.");
      return;
    }
    const permMap = {
      editor: "EDIT",
      viewer: "VIEW",
      commenter: "READONLY",
    };
    const members = collaborators.map((email) => ({
      email,
      permission: permMap[permission] || "EDIT",
    }));
    const success = await createGroup({ groupName, members, cursorColor });
    if (success) {
      setGroupName("");
      setCollaborators([]);
      setCollaboratorEmail("");
      setPermission("editor");
      setCursorColor("#ff00ff");
      onManageCollaborators && onManageCollaborators();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className={styles.title}>Share "Use case diagram"</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section}>
            <div className={styles.row}>
              <label className={styles.label} style={{ flex: 1 }}>
                Group Name
              </label>
            </div>
            <div className={styles.row}>
              <input
                type="text"
                className={styles.input}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name…"
                required
                style={{ flex: 1, marginRight: 8 }}
              />
            </div>
            <label className={styles.label} style={{ marginTop: "0.7rem" }}>
              Permission
            </label>
            <div className={styles.row}>
              <select
                className={styles.select}
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                <option value="commenter">Commenter</option>
              </select>
            </div>
            <label className={styles.label}>Collaborators</label>
            <div className={styles.row}>
              <input
                type="email"
                placeholder="Add collaborator email…"
                className={styles.input}
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
              />
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={handleAddCollaborator}
                style={{ marginLeft: 8 }}
                title="Add collaborator"
              >
                +
              </button>
            </div>
            <div className={styles.collaboratorList}>
              {collaborators.map((email) => (
                <span key={email} className={styles.collaboratorChip}>
                  {email}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveCollaborator(email)}
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
          <section className={styles.cursorSection}>
            <span className={styles.cursorLabel}>
              Collaborators cursor color
            </span>
            <input
              type="color"
              value={cursorColor}
              onChange={(e) => setCursorColor(e.target.value)}
              className={styles.colorInput}
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button
              className={styles.primaryBtn}
              type="submit"
              style={{ marginLeft: 12 }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create group"}
            </button>
          </section>
        </form>
        <section>
          <div className={styles.collabHeader}>
            <span className={styles.collabLabel}>Project collaborators</span>
            <a
              href="#"
              className={styles.manageLink}
              onClick={(e) => {
                e.preventDefault();
                if (onManageCollaborators) onManageCollaborators();
              }}
            >
              Manage
            </a>
          </div>
          <div className={styles.avatars}>
            <div className={styles.avatarA}>A</div>
            <div className={styles.avatarB}>B</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ShareModal;
