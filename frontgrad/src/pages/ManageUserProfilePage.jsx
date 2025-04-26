import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../components/styles/admin-pages/ManageUserProfilePage.module.css";
import { FaCamera, FaPencilAlt, FaSave } from "react-icons/fa";

const occupationOptions = [
  "Student",
  "Teacher",
  "Administration",
  "Management",
  "Other",
];

const ProfileDashboard = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
    occupation: "",
    username: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("http://localhost:9000/auth/me", { credentials: "include" })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Not authenticated")
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
          .then((r) => (r.ok ? r.json() : Promise.reject("User not found")))
          .then((data) => {
            setUserData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              password: "",
              image: data.profileImage || "",
              occupation: data.occupation || "",
              username: data.username || "",
            });
          })
          .catch((err) =>
            setError(err?.toString() || "Failed to fetch user info.")
          );
      })
      .catch((err) => setError(err?.toString() || "Authentication failed."));
  }, []);

  const updateField = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (label) => {
    const currentVal = userData[label];
    const newValue = prompt(
      `Enter new ${label.replace(/([A-Z])/, " $1")}:`,
      label === "password" ? "" : currentVal
    );

    if (newValue !== null && newValue.trim() !== "") {
      updateField(label, newValue);
    }
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
              <label className={styles.changeBtn} htmlFor="file-upload">
                <FaCamera /> Change Photo
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>

            {/* Username field at the top */}
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>Username</label>
              <div className={styles.fieldValue}>
                <input
                  className={styles.usernameInput}
                  type="text"
                  value={userData.username}
                  onChange={(e) => updateField("username", e.target.value)}
                  autoComplete="off"
                />
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
                  <div
                    className={styles.fieldValue}
                    style={
                      field === "occupation" ? { paddingRight: "0.7rem" } : {}
                    }
                  >
                    {field === "occupation" ? (
                      // Dropdown only for occupation
                      <select
                        className={styles.selectInput}
                        value={userData.occupation}
                        onChange={(e) =>
                          updateField("occupation", e.target.value)
                        }
                      >
                        <option value="">Select Occupation</option>
                        {occupationOptions.map((opt) => (
                          <option value={opt} key={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <span className={styles.fieldText}>
                          {userData[field]}
                        </span>
                        <button
                          className={styles.changeBtn}
                          onClick={() => handleEdit(field)}
                        >
                          <FaPencilAlt />{" "}
                          {field === "password" ? "Change" : "Edit"}
                        </button>
                      </>
                    )}
                  </div>
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
            <button className={styles.saveBtn} onClick={handleSave}>
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDashboard;
