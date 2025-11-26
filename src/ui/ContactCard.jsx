import React from 'react';
import styles from './ContactCard.module.css';

const ContactCard = ({ user, onClick, isChat = false }) => {
    return (
        <div className={styles.contactCard} onClick={onClick}>
            <div className={styles.avatar}>
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name || 'Avatar'}
                        className={styles.avatarImg}
                    />
                ) : (
                    <span className={styles.initials}>
                        {getInitials(user?.name) || 'X'}
                    </span>
                )}
            </div>
            <div className={styles.userInfo}>
                <div className={styles.topRow}>
                    <h4>{user?.name || 'Unknown User'}</h4>
                    {isChat && <span className={styles.time}>{user?.time}</span>}
                </div>
                <div className={styles.bottomRow}>
                    <p className={styles.lastMessage}>
                        {isChat ? user?.lastMessage : user?.status || 'en línea'}
                    </p>
                    {isChat && user?.unreadCount > 0 && (
                        <div className={styles.unreadBadge}>
                            {user.unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function getInitials(name) {
    if (!name) return '';
    const words = name.trim().split(' ');
    return (words[0][0] + (words[1]?.[0] || '')).toUpperCase();
}
export default ContactCard;