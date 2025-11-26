import React from "react";
import styles from "./ConversationPanel.module.css";
import MessageList from "../ui/MessageList";
import MessageComposer from "../ui/MessageComposer";

const ConversationPanel = ({
    activeConversation,
    onSendMessage,
    onDeleteMessage,
}) => {
    const handleSendMessage = (messageContent) => {
        const newMessage = {
            id: Date.now(),
            sender: "You",
            content: messageContent,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            isOwn: true,
        };

        if (onSendMessage) {
            onSendMessage(newMessage);
        }
    };

    // Función simple para filtrar mensajes
    const getMessagesToShow = () => {
        return activeConversation?.messages || [];
    };

    const handleIconClick = () => {};

    if (!activeConversation) {
        return (
            <div className={styles.conversationPanel}>
                <div className={styles.emptyState}>
                    <h3>Descarga WhatsApp Para Windows</h3>
                    <p>Descarga la aplicación para Windows y haz llamadas, comparte pantalla y disfruta de una experiencia más rápida.</p>
                    <p>
                        {<i className="bi bi-lock"></i>}Tus mensajes personales están cifrados de extremo a extremo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.conversationPanel}>
            <div className={styles.conversationHeader}>
                <div className={styles.contactInfo}>
                    <div className={styles.avatar}>
                        {activeConversation.avatar ? (
                            <img
                                src={activeConversation.avatar}
                                alt={activeConversation.name || 'Avatar'}
                                className={styles.avatarImg}
                            />
                        ) : (
                            activeConversation.name[0]
                        )}
                    </div>
                    <div className={styles.contactDetails}>
                        <h3>{activeConversation.name}</h3>
                        <p className={styles.status}>
                            {activeConversation.status || "en línea"}
                        </p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.actionButton} onClick={handleIconClick}>
                        <i className="bi bi-telephone"></i>
                    </button>
                    <button className={styles.actionButton} onClick={handleIconClick}>
                        <i className="bi bi-camera-video"></i>
                    </button>
                    <button
                        className={styles.actionButton}
                        title="Buscar"
                        onClick={handleIconClick}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>

            <MessageList
                messages={getMessagesToShow()}
                onDeleteMessage={onDeleteMessage}
            />
            <MessageComposer
                onSendMessage={handleSendMessage}
                conversationId={activeConversation?.id}
            />
        </div>
    );
};

export default ConversationPanel;
