import React from 'react';
import styles from './StatusPage.module.css';

const ComunitiesPage = () => {
    const sampleComunities = [];

    return (
        <div className={styles.statusPage}>
            <div className={styles.statusHeader}>
                <h2><i className="bi bi-people"></i> Comunidades</h2>
                <p>Comparte contenido en todo momento con tu comunidad.</p>
            </div>

            <div className={styles.statusContent}>
                <div className={styles.statusSection}>
                    <h3>Comunidades</h3>
                    <div className={styles.statusList}>
                        {sampleComunities.map((status) => (
                            <div
                                key={status.id}
                                className={styles.statusItem}
                            >
                                <div className={styles.statusAvatarWrapper}>
                                    <img
                                        src={status.imageUrl}
                                        alt={status.name}
                                        className={styles.statusAvatar}
                                    />
                                    {status.isOwn && <span className={styles.addIcon}>+</span>}
                                </div>
                                <div className={styles.statusInfo}>
                                    <span className={styles.statusName}>{status.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.statusActions}>
                    <button className={styles.createButton}>
                        <span><i className="bi bi-plus"></i></span>
                        Crear comunidad
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComunitiesPage;
