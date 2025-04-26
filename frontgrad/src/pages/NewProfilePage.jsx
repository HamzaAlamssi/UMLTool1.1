import React, { useRef, useState, useEffect } from "react";
import styles from "../components/styles/user-pages/NewProfilePage.module.css";

const occupationOptions = [
  "Student",
  "Teacher",
  "Administration",
  "Management",
  "Other",
];

const NewProfilePage = () => {
  const [profileImage, setProfileImage] = useState("");
  const [editStates, setEditStates] = useState({
    firstName: false,
    lastName: false,
    email: false,
    username: false,
  });
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    occupation: "",
    username: "",
    password: "********",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:9000/auth/me", {
      credentials: "include",
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Not authenticated"))
      )
      .then((user) => {
        fetch(
          `http://localhost:9000/api/users/${encodeURIComponent(
            user.username
          )}`,
          {
            credentials: "include",
          }
        )
          .then((r) =>
            r.ok ? r.json() : Promise.reject(new Error("User not found"))
          )
          .then((data) => {
            setFields({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              occupation: data.occupation || "",
              username: data.username || "",
              password: "********",
            });
            setProfileImage(data.profileImage || "");
          })
          .catch((err) => setError(err.message));
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = (field) => {
    setEditStates((prev) => {
      const isEditing = !prev[field];
      if (!isEditing) {
        handleSaveField(field, fields[field]);
      }
      return { ...prev, [field]: isEditing };
    });
  };

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveField = (field, value) => {
    setError("");
    setSuccess("");
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address");
      return;
    }
    if (field === "username" && (!value || value.length < 3)) {
      setError("Username must be at least 3 characters");
      return;
    }
    handleSave();
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `http://localhost:9000/api/users/${encodeURIComponent(fields.email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...fields, profileImage }),
        }
      );
      if (res.ok) {
        setSuccess("Profile updated successfully!");
      } else if (res.status === 400) {
        const data = await res.json();
        setError(Object.values(data).join(" "));
      } else {
        setError(await res.text());
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleChangePassword = () => {
    const newPassword = window.prompt("Enter your new password:");
    if (newPassword && newPassword.length >= 8) {
      setSuccess("Password changed successfully");
      setFields((prev) => ({ ...prev, password: "********" }));
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
          { label: "Email Address", field: "email" },
          { label: "Username", field: "username" },
        ].map(({ label, field }) => (
          <div className={styles.inputGroup} key={field}>
            <label className={styles.inputLabel}>{label}</label>
            <div className={styles.inputRow}>
              <input
                type={field === "email" ? "email" : "text"}
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
        {error && <div className={styles.errorMsg}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}
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
