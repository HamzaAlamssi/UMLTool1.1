import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/components-styles/Sidebar.module.css";
import { FiLayers, FiSquare, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import WhiteboardModal from "./WhiteboardModal";
import { createPortal } from "react-dom";
import { useProjects } from "../context/ProjectContext";

function NewDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { createProject } = useProjects();

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
      const data = await createProject(projectName);
      setShowModal(false);
      setProjectName("");
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
          onClick={() => {
            setShowDropdown(false);
            navigate("/Templates");
          }}
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
      </div>
      {createPortal(
        <WhiteboardModal
          open={showModal}
          onClose={() => setShowModal(false)}
          projectName={projectName}
          setProjectName={setProjectName}
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
