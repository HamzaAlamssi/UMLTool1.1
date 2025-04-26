import React, { useRef } from "react";
import {
  MdFileDownload,
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

  const exportDiagram = () => {
    if (!editorInstance?.current) return;

    const model = editorInstance.current.model;
    if (!model) return alert("Model is empty or undefined");

    const diagramData = {
      id: crypto.randomUUID(),
      title: "Use Case Diagram",
      model,
      lastUpdate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(diagramData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDiagram = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        if (!jsonData.model) throw new Error("Missing model");

        let model = jsonData.model;
        model.elements = model.elements ?? {};
        model.relationships = model.relationships ?? {};

        if (editorInstance.current) {
          editorInstance.current.model = model;
          console.log("✅ Imported successfully");
        }
      } catch (err) {
        console.error("❌ Import failed:", err.message);
      }
    };

    reader.readAsText(file);
  };

  const saveDiagramToDatabase = async () => {
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const model = editorInstance.current.model;
    if (!model) {
      alert("Model is empty or undefined");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:9000/api/projects/updateDiagram?projectId=${projectId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(model), // send as single-line JSON string
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
        {/* File dropdown */}
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
            <button className={styles.dropdownItem} onClick={exportDiagram}>
              <MdSaveAlt /> Save as JSON
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
        {/* Import dropdown */}
        <div className={styles.dropdown}>
          <button className={styles.menuButton}>
            <MdFileUpload style={{ marginRight: 4 }} /> Import
            <MdExpandMore style={{ fontSize: "1.1em", marginLeft: 6 }} />
          </button>
          <div className={styles.dropdownContent}>
            <button
              className={styles.dropdownItem}
              onClick={() => fileInputRef.current.click()}
            >
              JSON
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={importDiagram}
            />
          </div>
        </div>
        {/* Export button */}
        <button className={styles.menuButton} onClick={exportDiagram}>
          <MdFileDownload style={{ marginRight: 4 }} /> Export
        </button>
        {/* Help button */}
        <button className={styles.menuButton}>
          <MdHelpOutline style={{ marginRight: 4 }} /> Help
        </button>
      </div>
      <div className={styles.rightSection}>
        <button className={styles.blueBtn} onClick={saveDiagramToDatabase}>
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
