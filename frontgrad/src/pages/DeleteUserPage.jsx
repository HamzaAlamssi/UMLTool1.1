import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../components/styles/admin-pages/DeleteUserPage.module.css";
import { FaUsers, FaSearch } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";

const DeleteUserPage = () => {
  const { users, fetchUsers, deleteUsers, loading, error } = useAdmin();
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchUsers(e.target.value);
  };

  const toggleSelection = (email) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const deleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete selected users?")) return;
    setSuccess("");
    try {
      await deleteUsers(selected);
      setSuccess("Users deleted successfully!");
      setSelected([]);
    } catch (err) {
      // error is handled by context
    }
  };

  // Filter users to only show those with role USER (not ADMIN)
  const filteredUsers = users.filter(u => (u.role || u.roles || '').toString().toUpperCase().includes('USER') && !(u.role || u.roles || '').toString().toUpperCase().includes('ADMIN'));

  return (
    <div className={styles.container}>
      <AdminSidebar
        active="/DeleteUser"
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
                {filteredUsers.length}
              </span>
            </span>
            <div
              style={{
                position: "relative",
                width: "180px",
                marginLeft: 0,
              }}
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
          <div className={styles.userListContainer}>
            {loading ? (
              <div>Loading users, please wait...</div>
            ) : error ? (
              <div className={styles.emptyState}>Oops! Something went wrong: {error}</div>
            ) : users.length === 0 ? (
              <div className={styles.emptyState}>No users found. Try adjusting your search or add a new user!</div>
            ) : (
              <div className={styles.usersGrid}>
                {filteredUsers.reduce((rows, user, idx) => {
                  if (idx % 2 === 0) rows.push([]);
                  rows[rows.length - 1].push(user);
                  return rows;
                }, []).map((row, rowIdx) => (
                  <div key={rowIdx} className={styles.userRow}>
                    {row.map((user) => (
                      <div
                        key={user.email}
                        className={`${styles.userCard} ${selected.includes(user.email) ? styles.selected : ""}`}
                        onClick={(e) => {
                          // Only toggle selection if clicking the checkbox or checkmark
                          if (
                            e.target.tagName === "INPUT" ||
                            e.target.tagName === "SPAN"
                          ) {
                            toggleSelection(user.email);
                          }
                          // Otherwise, do nothing
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={styles.checkboxContainer}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(user.email)}
                            onChange={() => toggleSelection(user.email)}
                          />
                          <span className={styles.checkmark} />
                        </div>
                        <div className={styles.userAvatar}>
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.username} />
                          ) : user.firstName && user.lastName ? (
                            `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                          ) : user.username ? (
                            user.username[0]?.toUpperCase()
                          ) : user.email ? (
                            user.email[0]?.toUpperCase()
                          ) : (
                            "?"
                          )}
                        </div>
                        <div className={styles.userInfo}>
                          <div className={styles.userName}>{user.username}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    ))}
                    {row.length === 1 && <div className={styles.userCard} style={{ visibility: 'hidden' }} />} {/* For alignment if odd */}
                    {rowIdx !== Math.floor(filteredUsers.length / 2) && <hr className={styles.rowDivider} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <footer className={styles.dashboardFooter}>
            <div className={styles.selectedCount}>
              {selected.length} user(s) selected
            </div>
            {selected.length > 0 && (
              <button className={styles.deleteBtn} onClick={deleteSelected} disabled={loading}>
                {loading ? "Deleting..." : "Delete Selected"}
              </button>
            )}
            {success && (
              <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
};

export default DeleteUserPage;
