import React from 'react';
import styles from './StatusPage.module.css';

const StatusPage = () => {
    const sampleStatuses = [
        {
            id: 1,
            name: "Tu estado",
            time: "Añadir estado",
            isOwn: true
        }
    ];

    return (
        <div className={styles.statusPage}>
            <div className={styles.statusHeader}>
                <h2><i className="bi bi-person-badge"></i> Estados</h2>
                <p>Comparte fotos, videos y texto que desaparecen después de 24 horas.</p>
            </div>

            <div className={styles.statusContent}>
                <div className={styles.statusSection}>
                    <h3>Reciente</h3>
                    <div className={styles.statusList}>
                        {sampleStatuses.map((status) => (
                            <div
                                key={status.id}
                                className={styles.statusItem}
                            >
                                <div className={`${styles.statusAvatar} ${status.isOwn ? styles.ownStatus : ''} ${status.viewed ? styles.viewedStatus : ''}`}>
                                    {status.name[0]}
                                    {status.isOwn && <span className={styles.addIcon}>+</span>}
                                </div>
                                <div className={styles.statusInfo}>
                                    <span className={styles.statusName}>{status.name}</span>
                                    <span className={styles.statusTime}>{status.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.statusActions}>
                    <button className={styles.createButton}>
                        <span>{<i className="bi bi-plus"></i>}</span>
                        Crear estado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;