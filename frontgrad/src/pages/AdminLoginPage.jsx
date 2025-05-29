import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/LoginPage.module.css";

function AdminLoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:9000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        // Fetch user info to check role
        const userRes = await fetch("http://localhost:9000/auth/aUser", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.role === "ADMIN") {
            navigate("/ViewUsers");
          } else {
            setError("You are not authorized as admin.");
          }
        } else {
          setError("Failed to fetch user info.");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src="/image/frontIcon.png" alt="Illustration" />
      </div>
      <div className={styles.formSection}>
        <h2>Admin Login</h2>
        <p>Login as admin to manage users.</p>
        <form onSubmit={handleSubmit}>
          <img src="/image/logo2.png" alt="Logo" className={styles.logoImage} />
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={isPasswordVisible ? "/image/Eye.png" : "/image/closeEye.png"}
              alt="Toggle Password"
              className={styles.togglePassword}
              onClick={togglePasswordVisibility}
            />
          </div>
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <button type="submit" className={styles.loginButton}>
            Admin Log in
          </button>
        </form>
        <button
          style={{ marginTop: 16, fontSize: "0.9rem", background: "none", border: "none", color: "#348983", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/login")}
        >
          Back to User Login
        </button>
        <button
          style={{ marginTop: 8, fontSize: "0.9rem", background: "none", border: "none", color: "#348983", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/AdminRegister")}
        >
          Register as Admin
        </button>
      </div>
    </div>
  );
}

export default AdminLoginPage;