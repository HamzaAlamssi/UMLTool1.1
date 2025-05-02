import React from "react";
import styles from "./styles/components-styles/WhiteboardModal.module.css";

const DIAGRAM_TYPES = [
  { value: "ClassDiagram", label: "Class Diagram" },
  { value: "ObjectDiagram", label: "Object Diagram" },
  { value: "ActivityDiagram", label: "Activity Diagram" },
  { value: "UseCaseDiagram", label: "Use Case Diagram" },
  { value: "CommunicationDiagram", label: "Communication Diagram" },
  { value: "ComponentDiagram", label: "Component Diagram" },
  { value: "DeploymentDiagram", label: "Deployment Diagram" },
  { value: "PetriNet", label: "Petri Net" },
  { value: "ReachabilityGraph", label: "Reachability Graph" },
  { value: "SyntaxTree", label: "Syntax Tree" },
  { value: "Flowchart", label: "Flowchart" },
  { value: "BPMN", label: "BPMN" },
];

function WhiteboardModal({
  open,
  onClose,
  projectName,
  setProjectName,
  diagramType,
  setDiagramType,
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
          <label className={styles.label}>
            Diagram Type
            <select
              value={diagramType}
              onChange={(e) => setDiagramType(e.target.value)}
              required
              className={styles.input}
            >
              {DIAGRAM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
