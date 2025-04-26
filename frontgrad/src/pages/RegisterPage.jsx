import React, { useState } from "react";
import styles from "../components/styles/user-pages/LoginPage.module.css";
function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerData = { username, email, password };

    try {
      const response = await fetch("http://localhost:9000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(registerData),
      });
      const data = await response.text();
      setMessage(data);
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src="/image/frontIcon.png" alt="Illustration" />
      </div>
      <div className={styles.formSection}>
        <h2>Create an Account</h2>
        <p>Join us today and start your journey!</p>
        <form onSubmit={handleRegister}>
          <div>
            <img
              src="/image/logo2.png"
              alt="Logo"
              className={styles.logoImage}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
              id="password"
            />
            <img
              src={isPasswordVisible ? "/image/Eye.png" : "/image/closeEye.png"}
              alt="Toggle Password"
              className={styles.togglePassword}
              id="togglePassword"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Sign Up
          </button>
        </form>
        <p className={styles.smallText}>
          Already have an account? <a href="/login">Log in</a>
        </p>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
