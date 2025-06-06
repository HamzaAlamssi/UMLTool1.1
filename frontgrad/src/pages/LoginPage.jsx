import React, { useState } from "react";
import styles from "../components/styles/user-pages/LoginPage.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt: Email:", email, "Password:", password);

    const loginData = {
      email: email, // Use 'email' to match backend's usernameParameter
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
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Save the token in localStorage
        window.location.href = "/main";
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src="/image/frontIcon.png" alt="Illustration" />
      </div>
      <div className={styles.formSection}>
        <h2>Diagram Software</h2>
        <p>Your all in one solution for crafting stunning diagrams online!</p>

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

          <button type="submit" className={styles.loginButton}>
            Log in
          </button>
        </form>

        <div className={styles.loginDivider}>OR</div>

        <div className={styles.socialLogin}>
          <button className={styles.googleButton}>
            <img src="/image/google icone 2.png" alt="Google" /> Google
          </button>
        </div>

        <p className={styles.smallText}>
          <a href="/ForgotPassword">Forgot password?</a>
        </p>
        <p className={styles.smallText}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
        <button
          style={{ marginTop: 8, fontSize: "0.9rem", background: "none", border: "none", color: "#348983", cursor: "pointer", textDecoration: "underline" }}
          type="button"
          onClick={() => window.location.href = "/AdminLogin"}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
