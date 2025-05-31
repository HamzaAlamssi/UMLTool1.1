import React, { useState } from "react";
import styles from "../components/styles/user-pages/LoginPage.module.css";
function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerData = { username, email, password, firstName, lastName, occupation };

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
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
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
          <div className={styles.inputGroup}>
            <select
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Select Occupation (optional)</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Management">Management</option>
              <option value="Other">Other</option>
            </select>
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
