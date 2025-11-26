import React, { useState, useEffect } from 'react';
import styles from './MessageComposer.module.css';


const MessageComposer = ({ onSendMessage, conversationId }) => {
    const [message, setMessage] = useState('');

    // Limpiar mensaje cuando cambie la conversación
    useEffect(() => {
        setMessage('');
    }, [conversationId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    
    const handleIconClick = () => {};

    return (
        <div className={styles.messageComposer}>
            <div className={styles.leftButtons}>
                <button type="button" className={styles.emojiButton} title="Emoji" onClick={handleIconClick}>
                    <i className="bi bi-emoji-sunglasses-fill"></i>
                </button>
                <button type="button" className={styles.attachButton} title="Adjuntar" onClick={handleIconClick}>
                    <i className="bi bi-paperclip"></i>
                </button>
            </div>

            <form className={styles.messageForm} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe un mensaje"
                        className={styles.messageInput}
                    />
                </div>
            </form>

            <button
                type="button"
                className={styles.sendButton}
                onClick={message.trim() ? handleSubmit : handleIconClick}
                title={message.trim() ? "Enviar" : "Grabar audio"}
            >
                {message.trim() ? (
                    <i className="bi bi-send"></i>
                ) : (
                    <i className="bi bi-mic"></i>
                )}
            </button>
        </div>
    );
};

export default MessageComposer;