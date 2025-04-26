import React, { useState } from "react";
import "../components/styles/user-pages/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // هنا ترسل الطلب إلى API لاستعادة كلمة المرور
  };

  return (
    <div className="forgot-password-page">
      <div className="card">
        <p className="lock-icon">
          <i className="fas fa-lock"></i>
        </p>
        <h2>Forgot Password?</h2>
        <p>You can reset your password here</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              className="passInput"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            <a href="#"></a>Send My Password
          </button>
        </form>

        <div className="login-divider">OR</div>

        <p className="small-txt">
          <a href="/register">Create new account</a>
        </p>
        <p className="small-txt">
          <a href="/login">Back to login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
