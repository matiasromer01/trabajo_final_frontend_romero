import React from 'react';
import styles from './ReservationActions.module.css';

const ReservationActions = ({ reservation, stage, isDisabled, onCancel, onModify, onFinalize }) => {
    if (!reservation) return null;

    return (
        <div className={`${styles.actionsContainer} ${isDisabled ? styles.disabled : ''}`}>
            <div className={styles.summary}>📌 Reserva: {reservation.date} - {reservation.time}</div>
            {isDisabled ? (
                <div className={styles.disabledMessage}>Esta reserva fue modificada o cancelada</div>
            ) : (
                <div className={styles.buttonsRow}>
                    {stage === 'pending' && (
                        <>
                            <button className={styles.modifyButton} onClick={onModify}>✏️ Modificar</button>
                            <button className={styles.finalizeButton} onClick={onFinalize}>✅ Confirmar</button>
                        </>
                    )}
                    {stage === 'finalized' && (
                        <button className={styles.cancelButton} onClick={onCancel}>🗑️ Cancelar</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReservationActions;
