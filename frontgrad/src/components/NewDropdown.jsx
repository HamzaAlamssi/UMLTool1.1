import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/components-styles/Sidebar.module.css";
import { FiLayers, FiSquare, FiUpload } from "react-icons/fi";

function NewDropdown({ onCreateFromTemplate, onWhiteboard, onImport }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

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
          onClick={onWhiteboard}
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
    </div>
  );
}

export default NewDropdown;
