import React from "react";
import styles from "./styles/components-styles/Header.module.css";

function Header() {
  const focusSearch = () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.focus();
  };

  return (
    <div className={styles.header}>
      <div className={styles.logoSearch}>
        <img src="/image/logo.png" className={styles.logo} alt="Logo" />
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            id="searchInput"
            placeholder="Explore your factory..."
          />
          <img
            src="/image/Search.png"
            className={styles.searchIcon}
            alt="Search"
            onClick={focusSearch}
          />
        </div>
      </div>
      <div className={styles.headerButtons}>
        <button className={styles.iconButton}>
          <img
            src="/image/notifications.png"
            alt="Notifications"
            className={styles.buttonIcon}
          />
        </button>
        <button className={styles.iconButton}>
          <img src="/image/help.png" alt="Help" className={styles.buttonIcon} />
        </button>
      </div>
    </div>
  );
}

export default Header;
