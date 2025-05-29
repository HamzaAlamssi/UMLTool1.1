import React, { useEffect, useState } from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../components/styles/admin-pages/ViewUsersPage.module.css";

const ViewUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `http://localhost:9000/api/users/search?q=${encodeURIComponent(
          query
        )}`
        : "http://localhost:9000/api/users";
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError(await res.text());
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchUsers(e.target.value);
  };

  return (
    <div className={styles.container}>
      <AdminSidebar
        active="/ViewUsers"
        onLogout={() => (window.location.href = "/login")}
      />
      <main className={styles.main}>
        <div className={styles.usersDashboard}>
          <div className={styles.usersDashboardHeader}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.7rem",
                flex: 1,
              }}
            >
              <FaUsers /> Users
              <span
                style={{
                  background: "#fff",
                  color: "#348983",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  padding: "0.1rem 0.8rem",
                  marginLeft: "0.5rem",
                  border: "1px solid #e0e0e0",
                  display: "inline-block",
                }}
              >
                {users.length}
              </span>
            </span>
            <div
              style={{ position: "relative", width: "180px", marginLeft: 0 }}
            >
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                style={{
                  paddingRight: "2rem",
                  borderRadius: "0.7rem",
                  border: "1px solid #e0e0e0",
                  height: "2rem",
                  fontSize: "0.98rem",
                  background: "#fff",
                  color: "#348983",
                  width: "100%",
                }}
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch
                style={{
                  position: "absolute",
                  right: "0.6rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#348983",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>
          <div>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className={styles.emptyState}>{error}</div>
            ) : users.length === 0 ? (
              <div className={styles.emptyState}>No users found</div>
            ) : (
              <div className={styles.usersGrid}>
                {users.map((user) => (
                  <div
                    className={styles.userCard}
                    key={user.email}
                    onClick={() => navigate(`/ManageUserProfile?email=${encodeURIComponent(user.email)}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.userAvatar}>
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.username} />
                      ) : user.firstName && user.lastName && user.firstName[0] && user.lastName[0] ? (
                        `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      ) : (
                        user.username && user.username[0] ? user.username[0].toUpperCase() : "?"
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.username}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewUsersPage;
