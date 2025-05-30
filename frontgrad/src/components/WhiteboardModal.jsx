import React from "react";
import styles from "./styles/components-styles/WhiteboardModal.module.css";

function WhiteboardModal({
  open,
  onClose,
  projectName,
  setProjectName,
  loading,
  error,
  onSubmit,
}) {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className={styles.closeBtn}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className={styles.title}>Create New Project</h2>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>
            Project Name
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter project name"
              autoFocus
            />
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WhiteboardModal;
