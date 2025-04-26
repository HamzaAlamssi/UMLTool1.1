import React from "react";
import styles from "./styles/components-styles/ShareModal.module.css";

function ShareModal({ open, onClose, onManageCollaborators }) {
  if (!open) return null;
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
        <h2 className={styles.title}>Share “Use case diagram”</h2>
        <section className={styles.section}>
          <label className={styles.label}>Create group</label>
          <div className={styles.row}>
            <input
              type="text"
              placeholder="Enter group name…"
              className={styles.input}
            />
            <select className={styles.select} defaultValue="editor">
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className={styles.row}>
            <input
              type="email"
              placeholder="Add collaborators emails…"
              className={styles.input}
            />
            <button className={styles.primaryBtn}>Create group</button>
          </div>
        </section>
        <section className={styles.section}>
          <label className={styles.label}>Shareable link</label>
          <div className={styles.row}>
            <input
              type="url"
              placeholder="https://…"
              readOnly
              className={styles.input}
              value=""
            />
            <select className={styles.select} defaultValue="editor">
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="commenter">Commenter</option>
            </select>
          </div>
          <button
            className={styles.primaryBtn}
            style={{ marginTop: "0.3rem", width: "fit-content" }}
          >
            Generate link
          </button>
        </section>
        <section className={styles.cursorSection}>
          <span className={styles.cursorLabel}>Collaborators cursor color</span>
          <input
            type="color"
            defaultValue="#ff00ff"
            className={styles.colorInput}
          />
        </section>
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
