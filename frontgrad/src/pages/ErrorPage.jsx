import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import "../components/styles/user-pages/ErrorPage.css";

export default function ErrorPage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/login");
  };

  return (
    <div className="error-page-container">
      <Result
        status="404"
        title="404"
        subTitle="Oops! Page not found."
        extra={
          <Button type="primary" onClick={goHome}>
            Go to Homepage
          </Button>
        }
      />
    </div>
  );
}
