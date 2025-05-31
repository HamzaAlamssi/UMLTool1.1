import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/user-pages/LoginPage.module.css";

function AdminRegisterPage() {
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await fetch("http://localhost:9000/api/admin/add-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSuccess("Admin registered successfully! You can now log in.");
                setTimeout(() => navigate("/AdminLogin"), 1500);
            } else {
                const msg = await res.text();
                setError(msg || "Registration failed");
            }
        } catch (err) {
            setError("Error: " + err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <img src="/image/frontIcon.png" alt="Illustration" />
            </div>
            <div className={styles.formSection}>
                <h2>Admin Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <img
                            src={isPasswordVisible ? "/image/Eye.png" : "/image/closeEye.png"}
                            alt="Toggle Password"
                            className={styles.togglePassword}
                            onClick={() => setIsPasswordVisible((v) => !v)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
                    {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
                    <button type="submit" className={styles.loginButton}>Register as Admin</button>
                </form>
                <button
                    style={{ marginTop: 16, fontSize: "0.9rem", background: "none", border: "none", color: "#348983", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/AdminLogin")}
                >
                    Back to Admin Login
                </button>
            </div>
        </div>
    );
}

export default AdminRegisterPage;
