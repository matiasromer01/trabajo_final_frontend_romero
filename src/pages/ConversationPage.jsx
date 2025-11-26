import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeftPanel from '../panels/LeftPanel';
import ConversationPanel from '../panels/ConversationPanel';
import { useAppContext } from '../context/AppContext';
import { useEscapeKey } from '../hook/useEscapeKey';
import styles from './ConversationPage.module.css';

const ConversationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        isMobile,
        showChatList,
        handleSelectContact,
        handleSendMessage,
        handleDeleteMessage,
        handleDeselectContact,
    } = useAppContext();

    //ESC para sacar chat
    const handleEscapePress = React.useCallback(() => {
        console.log('ESC presionado en ConversationPage, activeConversation:', activeConversation);

        // Siempre limpiar el estado y navegar
        handleDeselectContact();

        // Navegar a /chats para mostrar la pantalla vacía
        console.log('Navegando desde ConversationPage hacia: /chats');
        navigate('/chats', { replace: true });
    }, [activeConversation, handleDeselectContact, navigate]);

    useEscapeKey(handleEscapePress);

    // Encontrar la conversación por ID cuando se carga la página o cambia el ID
    React.useEffect(() => {
        if (id && conversations.length > 0) {
            const conversationId = parseInt(id);
            const conversation = conversations.find(conv => conv.id === conversationId);
            if (conversation) {
                if (!activeConversation || activeConversation.id !== conversationId) {
                    setActiveConversation(conversation);
                }
            }
        }
    }, [id, conversations, activeConversation, setActiveConversation]);

    // Mantener comportamiento en mobile
    if (isMobile) {
        return (
            <div className={styles.conversationPage}>
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
                {!showChatList && !activeConversation && (
                    <div className={styles.emptyState}>
                        <h3>Descarga WhatsApp Para Windows</h3>
                        <p>Descarga la aplicación para Windows y haz llamadas, comparte pantalla y disfruta de una experiencia más rápida.</p>
                    </div>
                )}
            </div>
        );
    }

    // En desktop SIEMPRE mostrar ambos paneles
    return (
        <div className={styles.conversationPage}>
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
                </div>
            )}
        </div>
    );
};

export default ConversationPage;