import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ASideBar.module.css";

const ASidebar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    if (path === "/chats" || path === "/") {
      return location.pathname === "/chats" || location.pathname.startsWith("/chat/");
    }
    return location.pathname === path;
  };

  return (
    <div className={styles.asidebar}>
      {/* Chat de bandeja de entrada */}
      <button
        className={styles.menuItem}
        onClick={() => handleMenuClick("/chats")}
        title="Chats"
      >
        <span className={`${styles.menuIcon} ${isActive("/chats") ? styles.active : ""}`}>
          <i className={`bi bi-chat${isActive("/chats") ? "-fill" : ""}`}></i>
        </span>
      </button>

      {/* Estados */}
      <button
        className={styles.menuItem}
        onClick={() => handleMenuClick("/status")}
        title="Estados"
      >
        <span className={`${styles.menuIcon} ${isActive("/status") ? styles.active : ""}`}>
          <i className={`bi bi-person-badge${isActive("/status") ? "-fill" : ""}`}></i>
        </span>
      </button>

      {/* Comunidades */}
      <button
        className={styles.menuItem}
        onClick={() => handleMenuClick("/comunities")}
        title="Comunidades"
      >
        <span className={`${styles.menuIcon} ${isActive("/comunities") ? styles.active : ""}`}>
          <i className={`bi bi-people${isActive("/comunities") ? "-fill" : ""}`}></i>
        </span>
      </button>

      <div className={styles.bottomSpacer}></div>

      {/* Modo oscuro */}
      <button
        className={styles.menuItem}
        onClick={() => setDarkMode((prev) => !prev)}
        title="Modo oscuro"
      >
        <span className={styles.menuIcon}>
          <i className={`bi bi-moon${darkMode ? "-fill" : ""}`}></i>
        </span>
      </button>
      {/* Config */}
      <button
        className={styles.menuItem}
        onClick={() => handleMenuClick("/settings")}
        title="Ajustes"
      >
        <span className={`${styles.menuIcon} ${isActive("/settings") ? styles.active : ""}`}>
          <i className={`bi bi-gear${isActive("/settings") ? "-fill" : ""}`}></i>
        </span>
      </button>
    </div>
  );
};

export default ASidebar;