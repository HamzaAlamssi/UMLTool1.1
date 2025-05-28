import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../components/styles/admin-pages/ManageUserProfilePage.module.css";
import { FaCamera, FaSave, FaPencilAlt } from "react-icons/fa";

const occupationOptions = [
  "Student",
  "Teacher",
  "Administration",
  "Management",
  "Other",
];

const ProfileDashboard = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userUsername = params.get("username");

  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Ensure password is always initialized as empty
    image: "",
    occupation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editField, setEditField] = useState(null);
  const [originalEmail, setOriginalEmail] = useState(""); // Track original email

  useEffect(() => {
    if (!userUsername) return;
    fetch(`http://localhost:9000/api/users/by-username/${encodeURIComponent(userUsername)}`, { credentials: "include" })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("User not found")
      )
      .then((data) => {
        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "", // Ensure password is always empty when loading user data
          image: data.profileImage || "",
          occupation: data.occupation || "",
          username: data.username || "",
        });
      })
      .catch((err) => {
        setError(err?.toString() || "Failed to fetch user info.");
      });
  }, [userUsername]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const updateField = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    const { firstName, lastName } = userData;
    return (firstName?.[0] || "") + (lastName?.[0] || "");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `http://localhost:9000/api/users/${encodeURIComponent(
          userData.username
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...userData,
            profileImage: userData.image,
            ...(userData.password && { password: userData.password }),
          }),
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
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <AdminSidebar
        active="/ManageUserProfile"
        onLogout={() => (window.location.href = "/login")}
      />
      <main className={styles.main}>
        {!userUsername ? (
          <div style={{
            color: '#348983',
            fontWeight: 700,
            fontSize: '1.2rem',
            margin: '3rem auto',
            textAlign: 'center',
            background: '#eef7f6',
            border: '1.5px solid #2f847c',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
            maxWidth: 520,
            boxShadow: '0 4px 24px rgba(52, 137, 131, 0.10)',
            letterSpacing: '0.01em',
            transition: 'background 0.2s',
            display: 'block',
          }}>
           Please choose a user from the <span style={{color: '#2f847c', fontWeight: 800}}>View Users Page </span> to manage their profile.
          </div>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileBody}>
              <div className={styles.profileImageContainer}>
                <div className={styles.profileHeader}>
                  <h1 className={styles.profileTitle}>Manage User Profile</h1>
                </div>
                <div className={styles.profileImage}>
                  {userData.image ? (
                    <img src={userData.image} alt="User profile" />
                  ) : (
                    <div className={styles.initials}>{getInitials()}</div>
                  )}
                </div>
                <label
                  className={styles.changeBtn}
                  htmlFor="file-upload"
                  style={{
                    opacity: 1,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    background: '#2f847c',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(52,137,131,0.08)',
                    transition: 'background 0.2s',
                    fontWeight: 600
                  }}
                >
                  <FaCamera /> Change Photo
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                  disabled={false}
                />
              </div>

              {/* Username field (always read-only) */}
              <div className={styles.profileField}>
                <label className={styles.fieldLabel}>Username</label>
                <div className={styles.fieldValue}>
                  <span className={styles.fieldText}>{userData.username}</span>
                </div>
              </div>

              {/* Other fields */}
              {["firstName", "lastName", "email", "occupation", "password"].map(
                (field) => (
                  <div className={styles.profileField} key={field}>
                    <label className={styles.fieldLabel}>
                      {field === "firstName"
                        ? "First Name"
                        : field === "lastName"
                        ? "Last Name"
                        : field === "email"
                        ? "Email Address"
                        : field === "occupation"
                        ? "Occupation"
                        : "Password"}
                    </label>
                    {field === "occupation" ? (
                      <select
                        className={styles.selectInputSmall}
                        value={userData.occupation}
                        onChange={e => updateField("occupation", e.target.value)}
                        disabled={false}
                        style={{ opacity: 1, pointerEvents: 'auto', background: '#fff', color: '#222' }}
                      >
                        <option value="">Select Occupation</option>
                        {occupationOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <div className={styles.fieldValue}>
                        {editField === field ? (
                          <input
                            className={styles.selectInput}
                            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                            value={field === "password" ? "" : userData[field]}
                            onChange={e => updateField(field, e.target.value)}
                            onBlur={async () => {
                              if (field === "email" && userData.email !== originalEmail) {
                                try {
                                  const res = await fetch(`http://localhost:9000/api/users/${encodeURIComponent(userData.email)}`, { credentials: "include" });
                                  if (res.ok) {
                                    const data = await res.json();
                                    let othersWithEmail = [];
                                    if (Array.isArray(data)) {
                                      othersWithEmail = data.filter(u => u.email === userData.email && u.username && u.username !== userData.username);
                                    } else if (data && typeof data === "object") {
                                      if (data.email === userData.email && data.username && data.username !== userData.username) {
                                        othersWithEmail = [data];
                                      }
                                    }
                                    if (othersWithEmail.length > 0) {
                                      setError("This email is already taken by another user.");
                                      setTimeout(() => setError(""), 3000);
                                      return;
                                    }
                                  }
                                } catch {
                                  // Suppress backend error messages about non-unique results
                                }
                              }
                              setEditField(null);
                            }}
                            autoFocus
                            disabled={false}
                            style={{ opacity: 1, pointerEvents: 'auto', background: '#fff', color: '#222' }}
                          />
                        ) : (
                          <React.Fragment>
                            <span className={styles.fieldText}>
                              {field === "password" ? "********" : userData[field]}
                            </span>
                            {field !== "occupation" && (
                              <button
                                className={styles.changeBtn}
                                onClick={() => {
                                  setEditField(field);
                                  if (field === "email") setOriginalEmail(userData.email);
                                }}
                                disabled={false}
                                style={{
                                  opacity: 1,
                                  pointerEvents: 'auto',
                                  background: '#2f847c',
                                  color: '#fff',
                                  border: 'none',
                                  boxShadow: '0 2px 8px rgba(52,137,131,0.08)',
                                  transition: 'background 0.2s',
                                  fontWeight: 600,
                                  marginLeft: 8
                                }}
                              >
                                <FaPencilAlt /> Edit
                              </button>
                            )}
                          </React.Fragment>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}

              {error && (
                <div className={styles.passwordStrength} style={{ color: "red" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>
              )}
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={false}
                style={{
                  opacity: 1,
                  pointerEvents: 'auto',
                  background: '#2f847c',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(52,137,131,0.08)',
                  transition: 'background 0.2s',
                  fontWeight: 600
                }}
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileDashboard;
