import React, { useRef, useState, useEffect } from "react";
import styles from "../components/styles/user-pages/NewProfilePage.module.css";
import { useProjects } from "../context/ProjectContext";

const occupationOptions = [
  "Student",
  "Teacher",
  "Administration",
  "Management",
  "Other",
];

const NewProfilePage = () => {
  const { user, refresh } = useProjects();
  const [profileImage, setProfileImage] = useState("");
  const [editStates, setEditStates] = useState({
    firstName: false,
    lastName: false,
    username: false,
  });
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    username: "",
    password: "********",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user || !user.email) return;
    fetch(`http://localhost:9000/api/users/${encodeURIComponent(user.email)}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("User not found"))))
      .then((data) => {
        setFields({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          occupation: data.occupation || "",
          username: data.username || "",
          password: "********",
        });
        setProfileImage(data.profileImage || "");
      })
      .catch((err) => setError(err.message));
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = (field) => {
    setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!user || !user.email) {
      setError("User not loaded");
      return;
    }
    try {
      const payload = {
        email: user.email,
        username: fields.username,
        firstName: fields.firstName,
        lastName: fields.lastName,
        occupation: fields.occupation,
        profileImage,
      };
      const res = await fetch(
        `http://localhost:9000/api/users/${encodeURIComponent(user.email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        if (typeof refresh === "function") refresh();
      } else if (res.status === 400 || res.status === 409) {
        const data = await res.json();
        setError(data.error || Object.values(data).join(" "));
      } else {
        setError(await res.text());
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    const newPassword = window.prompt("Enter your new password:");
    if (newPassword && newPassword.length >= 8) {
      try {
        const res = await fetch(
          `http://localhost:9000/api/users/${encodeURIComponent(user.email)}/password`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ newPassword }),
          }
        );
        if (res.ok) {
          setSuccess("Password changed successfully");
          setFields((prev) => ({ ...prev, password: "********" }));
        } else {
          setError("Failed to change password");
        }
      } catch (err) {
        setError("Failed to change password");
      }
    } else if (newPassword) {
      setError("Password must be at least 8 characters");
    }
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.profileSection}>
        <div className={styles.profilePicture}>
          <img src={profileImage} alt="Profile" />
        </div>
        <button
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current.click()}
        >
          Change Photo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      <div className={styles.contentSection}>
        {[
          { label: "First Name", field: "firstName" },
          { label: "Last Name", field: "lastName" },
          { label: "Username", field: "username" },
        ].map(({ label, field }) => (
          <div className={styles.inputGroup} key={field}>
            <label className={styles.inputLabel}>{label}</label>
            <div className={styles.inputRow}>
              <input
                type="text"
                className={styles.editableField}
                value={fields[field]}
                disabled={!editStates[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
              />
              <button
                className={styles.btnEdit}
                onClick={() => toggleEdit(field)}
              >
                {editStates[field] ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        ))}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email Address</label>
          <input
            type="email"
            className={styles.editableField}
            value={user?.email || ""}
            disabled
            readOnly
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Occupation</label>
          <select
            className={styles.editableField}
            value={fields.occupation}
            onChange={(e) => handleFieldChange("occupation", e.target.value)}
          >
            {occupationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Password</label>
          <div className={styles.inputRow}>
            <input
              type="password"
              className={styles.editableField}
              value={fields.password}
              disabled
              readOnly
            />
            <button className={styles.btnEdit} onClick={handleChangePassword}>
              Change
            </button>
          </div>
        </div>
        {error && <div className={styles.errorMessage}>Oops! Something went wrong: {error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <button
            className={styles.btnEdit}
            onClick={handleSave}
            style={{ fontSize: "1.1rem", padding: "0.7rem 2.2rem" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProfilePage;
