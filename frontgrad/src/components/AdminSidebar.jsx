import React from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaUserEdit,
  FaSignOutAlt,
  FaShapes,
} from "react-icons/fa";
import styles from "./styles/components-styles/AdminSidebar.module.css";

const links = [
  { href: "/ViewUsers", label: "View Users", icon: <FaUsers /> },
  { href: "/AddUser", label: "Add User", icon: <FaUserPlus /> },
  { href: "/DeleteUser", label: "Delete User", icon: <FaUserMinus /> },
  {
    href: "/ManageUserProfile",
    label: "Manage User Profile",
    icon: <FaUserEdit />,
  },
  { href: "/AdminTemplates", label: "Templates", icon: <FaShapes /> },
];

function AdminSidebar({ active, onLogout }) {
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:9000/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    // Clear cookies/session if needed (browser will handle with credentials: 'include')
    window.location.href = '/login';
  };
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <img src="/image/logo2.png" className={styles.logo} alt="Logo" />
      </div>
      <nav className={styles.nav}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              active === link.href ? styles.active : ""
            }`}
          >
            <span style={{ marginRight: "0.7em", verticalAlign: "middle" }}>
              {link.icon}
            </span>
            {link.label}
          </a>
        ))}
      </nav>
      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt
            style={{ marginRight: "0.7em", verticalAlign: "middle" }}
          />{" "}
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
