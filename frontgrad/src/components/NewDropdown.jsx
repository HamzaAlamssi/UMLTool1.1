import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/components-styles/Sidebar.module.css";
import { FiLayers, FiSquare, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import WhiteboardModal from "./WhiteboardModal";
import { createPortal } from "react-dom";

function NewDropdown({ onCreateFromTemplate, onWhiteboard, onImport }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [diagramType, setDiagramType] = useState("UseCaseDiagram");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Modal submit handler
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Fetch current user info from backend
      const userRes = await fetch("http://localhost:9000/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!userRes.ok) throw new Error("Not authenticated");
      const userData = await userRes.json();
      const email = userData.username;

      const res = await fetch("http://localhost:9000/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: projectName,
          diagramType,
          ownerEmail: email, // use email, not username
        }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const data = await res.json();
      setShowModal(false);
      setProjectName("");
      setDiagramType("UseCaseDiagram");
      // Navigate to the new project page
      navigate(`/project/${data.id}`);
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dropdownWrapper}>
      <button
        ref={buttonRef}
        className={styles.newButton}
        onClick={() => setShowDropdown((v) => !v)}
        aria-haspopup="true"
        aria-expanded={showDropdown}
        type="button"
      >
        <span className={styles.newButtonText}>+ New</span>
      </button>
      <div
        ref={dropdownRef}
        className={`${styles.dropdownMenu} ${
          showDropdown ? styles.showDropdown : ""
        }`}
      >
        <button
          className={styles.dropdownOption}
          type="button"
          onClick={onCreateFromTemplate}
        >
          <FiLayers size={18} color="#22645c" />
          From Template
        </button>
        <button
          className={styles.dropdownOption}
          type="button"
          onClick={() => {
            setShowDropdown(false);
            setShowModal(true);
          }}
        >
          <FiSquare size={18} color="#22645c" />
          Whiteboard
        </button>
        <button
          className={styles.dropdownOption}
          type="button"
          onClick={onImport}
        >
          <FiUpload size={18} color="#22645c" />
          Import
        </button>
      </div>
      {createPortal(
        <WhiteboardModal
          open={showModal}
          onClose={() => setShowModal(false)}
          projectName={projectName}
          setProjectName={setProjectName}
          diagramType={diagramType}
          setDiagramType={setDiagramType}
          loading={loading}
          error={error}
          onSubmit={handleCreateProject}
        />,
        document.body
      )}
    </div>
  );
}

export default NewDropdown;
