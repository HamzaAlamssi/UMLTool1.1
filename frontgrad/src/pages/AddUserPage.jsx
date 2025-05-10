import React, { useState, useEffect, useRef } from "react";
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
  const messageTimeout = useRef(null);

  const clearMessages = () => {
    messageTimeout.current && clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => {
      setSuccess("");
      setErrors({});
    }, 3000);
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName) errs.firstName = "First name is required.";
    if (!formData.lastName) errs.lastName = "Last name is required.";
    if (!formData.username) errs.username = "Username is required.";
    if (!formData.email) errs.email = "Email is required.";
    if (!formData.password) errs.password = "Password is required.";
    return errs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      clearMessages();
      return;
    }
    try {
      const res = await fetch("http://localhost:9000/api/admin/add-user", {
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
        clearMessages();
      } else if (res.status === 409) {
        setErrors({ general: "User with this email or username already exists." });
        clearMessages();
      } else if (res.status === 400) {
        const data = await res.json();
        setErrors(data);
        clearMessages();
      } else {
        setErrors({ general: await res.text() });
        clearMessages();
      }
    } catch (err) {
      setErrors({ general: err.message });
      clearMessages();
    }
  };

  useEffect(() => {
    return () => messageTimeout.current && clearTimeout(messageTimeout.current);
  }, []);

  return (
    <div className={styles.container}>
      <AdminSidebar
        active="/AddUser"
        onLogout={() => (window.location.href = "/login")}
      />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1>Add New User</h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              {errors.firstName && (
                <div className={styles.passwordStrength}>{errors.firstName}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              {errors.lastName && (
                <div className={styles.passwordStrength}>{errors.lastName}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoComplete="off"
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
                autoComplete="off"
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
                  autoComplete="new-password"
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
              <div style={{ color: "#e74c3c", fontWeight: 600, marginBottom: "1rem", fontSize: "1.08rem" }}>
                {errors.general}
              </div>
            )}
            {success && (
              <div style={{ color: "#388e3c", fontWeight: 600, marginBottom: "1rem", fontSize: "1.08rem" }}>
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
