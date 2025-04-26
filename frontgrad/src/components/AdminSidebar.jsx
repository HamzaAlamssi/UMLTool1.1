import React from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaUserEdit,
  FaSignOutAlt,
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
];

function AdminSidebar({ active, onLogout }) {
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
        <button className={styles.logoutBtn} onClick={onLogout}>
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
