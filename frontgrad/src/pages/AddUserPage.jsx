import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../components/styles/admin-pages/AddUserPage.module.css";

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    try {
      const res = await fetch("http://localhost:9000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess("User added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
        });
      } else if (res.status === 400) {
        const data = await res.json();
        setErrors(data);
      } else {
        setErrors({ general: await res.text() });
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className={styles.container}>
      <AdminSidebar
        active="/AddUser"
        onLogout={() => (window.location.href = "/login")}
      />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1>Add New User</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && (
                <div className={styles.passwordStrength}>{errors.username}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && (
                <div className={styles.passwordStrength}>{errors.email}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Show password" : "Hide password"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <div className={styles.passwordStrength}>{errors.password}</div>
              )}
            </div>
            {errors.general && (
              <div className={styles.passwordStrength}>{errors.general}</div>
            )}
            {success && (
              <div style={{ color: "green", marginBottom: "1rem" }}>
                {success}
              </div>
            )}
            <button type="submit" className={styles.btn}>
              Add User
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddUserPage;
