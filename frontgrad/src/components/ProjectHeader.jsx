import React, { useRef } from "react";
import {
  MdHelpOutline,
  MdExpandMore,
  MdInsertDriveFile,
  MdFolderOpen,
  MdAddBox,
  MdSaveAlt,
  MdFileUpload,
  MdZoomIn,
  MdZoomOut,
} from "react-icons/md";
import { FaSlideshare } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { useParams } from "react-router-dom";
import styles from "./styles/components-styles/ProjectHeader.module.css";

const ProjectHeader = ({ editorInstance, onMessagesClick, onShareClick }) => {
  const fileInputRef = useRef(null);
  const { id: projectId } = useParams();

  // Export canvas model as JSON (same as yaqeen.jsx)
  const exportDiagram = () => {
    console.log("ProjectHeader: exportDiagram called", editorInstance);
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const { classes, relationships } = editorInstance.current;
    console.log("ProjectHeader: exportDiagram model", { classes, relationships });
    if (!Array.isArray(classes) || !Array.isArray(relationships)) {
      alert("No model to export.");
      return;
    }
    const data = { classes, relationships };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uml_project.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    a.remove();
  };

  // Import JSON into canvas model (same as yaqeen.jsx)
  const importDiagram = (event) => {
    console.log("ProjectHeader: importDiagram called", editorInstance);
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data.classes) && Array.isArray(data.relationships)) {
          editorInstance.current.setModel(data.classes, data.relationships);
          alert("Model imported successfully!");
        } else {
          alert("Invalid JSON project format.");
        }
      } catch (err) {
        alert("Could not parse JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Save canvas model to DB (update diagram_json)
  const saveDiagramToDatabase = async () => {
    console.log("ProjectHeader: saveDiagramToDatabase called", editorInstance);
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const { classes, relationships } = editorInstance.current;
    console.log("ProjectHeader: saveDiagramToDatabase model", { classes, relationships });
    if (!Array.isArray(classes) || !Array.isArray(relationships)) {
      alert("No model to save.");
      return;
    }
    try {
      // Send as a single string (not object) for diagramJson
      const res = await fetch(
        `http://localhost:9000/api/projects/updateDiagram?projectId=${projectId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(JSON.stringify({ classes, relationships })),
        }
      );
      if (res.ok) {
        alert("Diagram saved to database!");
      } else {
        alert("Failed to save diagram.");
      }
    } catch (err) {
      alert("Error saving diagram: " + err.message);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Modern logo area */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #348983 60%, #5eead4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(52, 137, 131, 0.10)",
            marginRight: "0.7rem",
          }}
        >
          <MdInsertDriveFile size={28} color="#fff" />
        </div>
        {/* File dropdown (keep for New/Open) */}
        <div className={styles.dropdown}>
          <button className={styles.menuButton}>
            <MdInsertDriveFile style={{ marginRight: 4 }} /> File
            <MdExpandMore style={{ fontSize: "1.1em", marginLeft: 6 }} />
          </button>
          <div className={styles.dropdownContent}>
            <button className={styles.dropdownItem}>
              <MdAddBox /> New
            </button>
            <button className={styles.dropdownItem}>
              <MdFolderOpen /> Open
            </button>
          </div>
        </div>
        {/* View dropdown */}
        <div className={styles.dropdown}>
          <button className={styles.menuButton}>
            View <MdExpandMore style={{ fontSize: "1.1em", marginLeft: 6 }} />
          </button>
          <div className={styles.dropdownContent}>
            <button className={styles.dropdownItem}>
              <MdZoomIn /> Zoom In
            </button>
            <button className={styles.dropdownItem}>
              <MdZoomOut /> Zoom Out
            </button>
          </div>
        </div>
        {/* Help button */}
        <button className={styles.menuButton}>
          <MdHelpOutline style={{ marginRight: 4 }} /> Help
        </button>
      </div>
      <div className={styles.rightSection}>
        <button
          className={styles.blueBtn}
          onClick={exportDiagram}
          title="Export diagram as JSON"
        >
          <MdSaveAlt style={{ marginRight: 4 }} /> Export JSON
        </button>
        <button
          className={styles.blueBtn}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          title="Import diagram from JSON"
        >
          <MdFileUpload style={{ marginRight: 4 }} /> Import JSON
        </button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={importDiagram}
        />
        {/* --- Save button --- */}
        <button
          className={styles.blueBtn}
          onClick={saveDiagramToDatabase}
          title="Save diagram to database"
        >
          <MdSaveAlt style={{ marginRight: 4 }} /> Save
        </button>
        {/* Share button */}
        <button className={styles.blueBtn} onClick={onShareClick}>
          <FaSlideshare style={{ marginRight: 4 }} /> Share
        </button>
        {/* Messages button */}
        <button className={styles.grayBtn} onClick={onMessagesClick}>
          <TbMessageChatbot style={{ marginRight: 4 }} /> Messages
        </button>
        {/* User avatar */}
        <div
          style={{
            height: "2.3rem",
            width: "2.3rem",
            borderRadius: "9999px",
            border: "2px solid #5eead4",
            background: "linear-gradient(135deg, #fff 60%, #e0fdfa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "0.7rem",
            boxShadow: "0 2px 8px rgba(52, 137, 131, 0.10)",
          }}
        >
          <FiUser size={22} color="#348983" />
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;
