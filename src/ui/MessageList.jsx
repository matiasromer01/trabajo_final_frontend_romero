import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import InlineReservationPicker from '../components/InlineReservationPicker';
import ReservationActions from './ReservationActions';
import styles from './MessageList.module.css';

const MessageList = ({ messages = [], onDeleteMessage }) => {
    const { 
        handleOpenReservationPicker, 
        handleConfirmReservation,
        handleCancelReservation,
        handleModifyReservation,
        handleFinalizeReservation 
    } = useAppContext();
    const messageRefs = useRef({});
    const containerRef = useRef(null);

    // Eliminación de mensaje
    const handleDeleteMessage = (messageId) => {
        if (onDeleteMessage) {
            onDeleteMessage(messageId);
        }
    };

    return (
        <div className={styles.messageList} ref={containerRef}>
            {messages.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No hay mensajes aún</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={message.id}
                        ref={el => messageRefs.current[index] = el}
                        className={`${styles.messageContainer} ${message.isOwn ? styles.ownMessage : styles.otherMessage}`}
                    >
                        <div className={styles.messageBubble}>
                            <div className={styles.messageContent}>
                                {message.content}
                            </div>
                            
                            {/* Botón de reserva si el mensaje lo tiene */}
                            {message.hasReservationButton && (
                                <button 
                                    className={styles.reservationButton}
                                    onClick={handleOpenReservationPicker}
                                >
                                    📅 Reservar una cancha
                                </button>
                            )}

                            {/* Picker inline si el mensaje lo requiere */}
                            {message.isReservationPicker && (
                                <div className={styles.pickerContainer}>
                                    <InlineReservationPicker onConfirm={handleConfirmReservation} />
                                </div>
                            )}

                            {/* Acciones de reserva (cancelar, modificar, confirmar) */}
                            {message.isReservationActions && message.reservation && (
                                <ReservationActions 
                                    reservation={message.reservation}
                                    stage={message.reservationStage}
                                    isDisabled={message.isDisabled}
                                    onCancel={() => handleCancelReservation(message.reservation.id, message.reservation)}
                                    onModify={() => handleModifyReservation(message.reservation, message.reservationStage)}
                                    onFinalize={() => handleFinalizeReservation(message.reservation)}
                                />
                            )}
                            
                            <div className={styles.messageTime}>
                                {message.timestamp}
                                {message.isOwn && (
                                    <span className={styles.checkmarks}>✓✓</span>
                                )}
                            </div>
                        </div>

                        {/* Eliminar - solo para mensajes propios */}
                        {message.isOwn && (
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteMessage(message.id)}
                                title="Eliminar"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MessageList;