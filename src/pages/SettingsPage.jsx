import React from 'react';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
    return (
        <div className={styles.settingsPage}>
            <div className={styles.settingsHeader}>
                <h2>{<i className="bi bi-gear-fill"></i>} Ajustes</h2>
                <p>Personaliza tu experiencia de WhatsApp</p>
            </div>

            <div className={styles.settingsContent}>
                <div className={styles.settingsSection}>
                    <h3>Cuenta</h3>
                    <div className={styles.settingsItem}>
                        <span className={styles.settingsIcon}><i className={`bi bi-person ${styles.subIcon}`}></i></span>
                        <div className={styles.settingsText}>
                            <span className={styles.settingsTitle}>Perfil</span>
                            <span className={styles.settingsDesc}></span>
                        </div>
                    </div>
                    <div className={styles.settingsItem}>
                        <span className={styles.settingsIcon}><i className={`bi bi-lock ${styles.subIcon}`}></i></span>
                        <div className={styles.settingsText}>
                            <span className={styles.settingsTitle}>Privacidad</span>
                            <span className={styles.settingsDesc}></span>
                        </div>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3>Chats</h3>
                    <div className={styles.settingsItem}>
                        <span className={styles.settingsIcon}><i className={`bi bi-chat ${styles.subIcon}`}></i></span>
                        <div className={styles.settingsText}>
                            <span className={styles.settingsTitle}>Respaldo de chats</span>
                            <span className={styles.settingsDesc}></span>
                        </div>
                    </div>
                    <div className={styles.settingsItem}>
                        <span className={styles.settingsIcon}><i className={`bi bi-collection ${styles.subIcon}`}></i></span>
                        <div className={styles.settingsText}>
                            <span className={styles.settingsTitle}>Calidad de carga de archivos multimedia</span>
                        </div>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3>Notificaciones</h3>
                    <div className={styles.settingsItem}>
                        <span className={styles.settingsIcon}><i className={`bi bi-bell ${styles.subIcon}`}></i></span>
                        <div className={styles.settingsText}>
                            <span className={styles.settingsTitle}>Notificaciones de mensajes</span>
                            <span className={styles.settingsDesc}></span>
                        </div>
                    </div>
                    <div className={styles.settingsItem}>
                        <span className={styles.settingsIcon}><i className={`bi bi-arrow-down ${styles.subIcon}`}></i></span>
                        <div className={styles.settingsText}>
                            <span className={styles.settingsTitle}>Sincronización en segundo plano</span>
                        </div>
                    </div>
                </div>
                <div className={styles.settingsItem}>
                    <span className={styles.settingsIcon}><i className={`bi bi-box-arrow-in-left ${styles.subIcon}`}></i></span>
                    <div className={styles.settingsText}>
                        <span className={styles.settingsTitle}>Cerrar Sesión</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;