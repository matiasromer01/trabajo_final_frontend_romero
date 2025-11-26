import React from 'react';
import { useNavigate } from 'react-router-dom';
import LeftPanel from '../panels/LeftPanel';
import ConversationPanel from '../panels/ConversationPanel';
import { useAppContext } from '../context/AppContext';
import { useEscapeKey } from '../hook/useEscapeKey';
import styles from './PrincipalScreen.module.css';

const PrincipalScreen = () => {
    const navigate = useNavigate();
    const {
        conversations,
        activeConversation,
        isMobile,
        showChatList,
        handleSelectContact,
        handleSendMessage,
        handleDeleteMessage,
        handleDeselectContact
    } = useAppContext();

    // ESC para chat
    const handleEscapePress = React.useCallback(() => {
        console.log('ESC presionado, activeConversation:', activeConversation);

        // Limpiar chat y nav
        handleDeselectContact();

        // nav /chats
        const currentPath = window.location.pathname;
        console.log('Navegando desde:', currentPath, 'hacia: /chats');

        navigate('/chats', { replace: true });
    }, [activeConversation, handleDeselectContact, navigate]);

    useEscapeKey(handleEscapePress);

    //mobile
    if (isMobile) {
        return (
            <div className={styles.principalPage}>
                {showChatList && (
                    <LeftPanel
                        onSelectContact={handleSelectContact}
                        conversations={conversations}
                    />
                )}
                {!showChatList && activeConversation && (
                    <ConversationPanel
                        activeConversation={activeConversation}
                        onSendMessage={handleSendMessage}
                        onDeleteMessage={handleDeleteMessage}
                    />
                )}
            </div>
        );
    }

    //desktop
    return (
        <div className={styles.principalPage}>
            <LeftPanel
                onSelectContact={handleSelectContact}
                conversations={conversations}
            />
            {activeConversation ? (
                <ConversationPanel
                    activeConversation={activeConversation}
                    onSendMessage={handleSendMessage}
                    onDeleteMessage={handleDeleteMessage}
                />
            ) : (
                <div className={styles.emptyState}>
                    <h3>Descarga WhatsApp Para Windows</h3>
                    <p>Descarga la aplicación para Windows y haz llamadas, comparte pantalla y disfruta de una experiencia más rápida.</p>
                    <p className={styles.escHint}>{<i className="bi bi-lightbulb"></i>} Utiliza ESC para volver al menú principal.</p>
                    <span>{<i className="bi bi-lock"></i>}Tus mensajes personales están cifrados de extremo a extremo</span>
                </div>
            )}
        </div>
    );
};

export default PrincipalScreen;