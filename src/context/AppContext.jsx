import React, { createContext, useContext, useState, useEffect } from "react";
import mensajesService from "../services/mensajes.service";
import reservasService from "../services/reservas.service";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

const CANCHAS_ROMERO_ID = "canchas-romero"; // ID especial para el bot


export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext debe ser usado dentro de AppProvider");
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const { user } = useAuth();
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    const [reservationToModify, setReservationToModify] = useState(null); // ID de reserva en proceso de modificación

    // Detectar mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setShowChatList(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Cargar conversaciones reales desde la API
    useEffect(() => {
        const loadConversations = async () => {
            try {
                const data = await mensajesService.getConversations();

                // Asegurar que siempre existe la conversación con Canchas Romero
                const hasCanchasRomero = data.some(conv => conv.id === CANCHAS_ROMERO_ID);

                const conversationsList = [...(Array.isArray(data) ? data : [])];

                // Si no existe, crear conversación vacía con Canchas Romero
                if (!hasCanchasRomero) {
                    conversationsList.unshift({
                        id: CANCHAS_ROMERO_ID,
                        name: "Canchas Romero",
                        status: "en línea",
                        lastMessage: "Haz clic para reservar una cancha",
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        unreadCount: 0,
                        messages: [],
                        isBot: true, // Flag para identificar que es un bot
                    });
                }

                setConversations(conversationsList);
            } catch (error) {
                console.error("Error al cargar conversaciones:", error);
                // Siempre tener al menos Canchas Romero disponible
                setConversations([{
                    id: CANCHAS_ROMERO_ID,
                    name: "Canchas Romero",
                    status: "en línea",
                    lastMessage: "Haz clic para reservar una cancha",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    unreadCount: 0,
                    messages: [],
                    isBot: true,
                }]);
            }
        };
        loadConversations();
    }, []);

    const handleSelectContact = (contact) => {
        setActiveConversation(contact);
        if (isMobile) {
            setShowChatList(false);
        }
    };

    const handleDeselectContact = () => {
        setActiveConversation(null);
        if (isMobile) {
            setShowChatList(true);
        }
    };

    const handleSendMessage = async (message) => {
        if (!activeConversation) return;

        try {
            // Si es Canchas Romero y es el primer mensaje
            const isCanchasRomero = activeConversation.id === CANCHAS_ROMERO_ID;
            const isFirstMessage = !activeConversation.messages || activeConversation.messages.length === 0;

            // Agregar mensaje del usuario
            const userMessage = {
                id: Date.now(),
                sender: "You",
                content: message.content,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                isOwn: true,
            };

            // Si NO es bot, enviar a la API
            if (!isCanchasRomero) {
                await mensajesService.sendMessage(activeConversation.id, { content: message.content });
            }

            // Actualizar conversación con mensaje del usuario
            let updatedConversations = conversations.map((conv) => {
                if (conv.id === activeConversation.id) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), userMessage],
                        lastMessage: userMessage.content,
                        time: userMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });

            setConversations(updatedConversations);

            // Si es Canchas Romero y es primer mensaje, responder automáticamente
            if (isCanchasRomero && isFirstMessage) {
                setTimeout(() => {
                    const userName = user?.name || "Usuario";
                    const welcomeMessage = {
                        id: Date.now() + 1,
                        sender: "Canchas Romero",
                        content: `¡Hola ${userName}! 👋 Bienvenido a Canchas Romero. ¿Te gustaría reservar una cancha?`,
                        timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        isOwn: false,
                        isBot: true,
                        hasReservationButton: true, // Flag para mostrar botón especial
                    };

                    const finalConversations = conversations.map((conv) => {
                        if (conv.id === CANCHAS_ROMERO_ID) {
                            const messages = [...(conv.messages || []), userMessage, welcomeMessage];
                            const updatedConv = {
                                ...conv,
                                messages,
                                lastMessage: welcomeMessage.content,
                                time: welcomeMessage.timestamp,
                            };
                            setActiveConversation(updatedConv);
                            return updatedConv;
                        }
                        return conv;
                    });

                    setConversations(finalConversations);
                }, 800); // Simular delay de respuesta
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const handleDeleteMessage = (messageId) => {
        if (!activeConversation) return;

        const updatedConversations = conversations.map((conv) => {
            if (conv.id === activeConversation.id) {
                const filteredMessages = conv.messages.filter(
                    (msg) => msg.id !== messageId
                );

                const lastMessage =
                    filteredMessages.length > 0
                        ? filteredMessages[filteredMessages.length - 1].content
                        : "Sin mensajes";

                const lastTime =
                    filteredMessages.length > 0
                        ? filteredMessages[filteredMessages.length - 1].timestamp
                        : "";

                const updatedConv = {
                    ...conv,
                    messages: filteredMessages,
                    lastMessage: lastMessage,
                    time: lastTime,
                };

                setActiveConversation(updatedConv);
                return updatedConv;
            }
            return conv;
        });

        setConversations(updatedConversations);
    };

    const handleOpenReservationPicker = () => {
        // Agregar mensaje con selector de fecha y hora inline
        const pickerMessage = {
            id: Date.now(),
            sender: "Canchas Romero",
            content: "Selecciona fecha y horario:",
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            isOwn: false,
            isBot: true,
            isReservationPicker: true, // Flag para mostrar el selector
        };

        const updatedConversations = conversations.map((conv) => {
            if (conv.id === CANCHAS_ROMERO_ID) {
                const updatedConv = {
                    ...conv,
                    messages: [...(conv.messages || []), pickerMessage],
                    lastMessage: pickerMessage.content,
                    time: pickerMessage.timestamp,
                };
                setActiveConversation(updatedConv);
                return updatedConv;
            }
            return conv;
        });

        setConversations(updatedConversations);
    };

    const handleConfirmReservation = async (reservationData) => {
        // Verificar si es un error de validación
        if (reservationData.error) {
            const errorMessage = {
                id: Date.now(),
                sender: 'Canchas Romero',
                content: reservationData.message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
            };

            const updatedConversations = conversations.map((conv) => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), errorMessage],
                        lastMessage: '❌ Fecha inválida',
                        time: errorMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });

            setConversations(updatedConversations);
            return;
        }

        try {
            // Payload común
            const reservaPayload = {
                canchaId: 1,
                fecha: reservationData.dateISO,
                hora: reservationData.time,
            };

            let reservaProcesada;
            let mensajeAccion;

            if (reservationToModify) {
                // Actualización de reserva existente
                reservaProcesada = await reservasService.update(reservationToModify, reservaPayload);
                mensajeAccion = 'Reserva modificada (pendiente)';
            } else {
                // Creación de nueva reserva
                reservaProcesada = await reservasService.create(reservaPayload);
                mensajeAccion = 'Reserva creada (pendiente)';
            }

            const actionsMessage = {
                id: Date.now() + 1,
                sender: 'Canchas Romero',
                content: `📅 Fecha reservada: ${reservationData.date}\n⏰ Hora: ${reservationData.time}\n\nReserva pendiente de confirmación definitiva. Puedes modificarla o confirmarla.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
                isReservationActions: true,
                reservationStage: 'pending',
                reservation: {
                    id: reservaProcesada?.id,
                    date: reservationData.date,        
                    time: reservationData.time,       
                    dateISO: reservationData.dateISO,  
                },
            };

            // Limpiar estado de modificación si se usó
            if (reservationToModify) {
                setReservationToModify(null);
            }

            const updatedConversations = conversations.map((conv) => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    // Marcar mensajes de acciones anteriores como deshabilitados
                    const updatedMessages = (conv.messages || []).map(msg => {
                        if (msg.isReservationActions && msg.reservationStage === 'pending') {
                            return { ...msg, isDisabled: true };
                        }
                        return msg;
                    });

                    const updatedConv = {
                        ...conv,
                        messages: [...updatedMessages, actionsMessage],
                        lastMessage: mensajeAccion,
                        time: actionsMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });

            setConversations(updatedConversations);
        } catch (error) {
            console.error("Error al confirmar reserva:", error);

            // Verificar si es un error de turno ocupado (409)
            const isConflictError = error.response?.status === 409;
            const errorContent = isConflictError
                ? `❌ Turno ya ocupado\n\nEse horario ya fue reservado por otro usuario. Por favor, selecciona otro horario disponible.`
                : `❌ Lo sentimos, hubo un error al procesar tu reserva. Por favor, intenta nuevamente o contáctanos directamente.`;

            // Mostrar mensaje de error en el chat
            const errorMessage = {
                id: Date.now(),
                sender: "Canchas Romero",
                content: errorContent,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                isOwn: false,
                isBot: true,
            };

            const updatedConversations = conversations.map((conv) => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), errorMessage],
                        lastMessage: "❌ Error al reservar",
                        time: errorMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });

            setConversations(updatedConversations);
        }
    };

    // Cancelar reserva
    const handleCancelReservation = async (reservationId, reservationDetails) => {
        // Mostrar confirmación antes de cancelar
        const confirmed = window.confirm(
            `¿Estás seguro que deseas cancelar tu reserva?\n\n📅 Fecha: ${reservationDetails?.date || 'N/A'}\n⏰ Hora: ${reservationDetails?.time || 'N/A'}\n\nEsta acción no se puede deshacer.`
        );
        
        if (!confirmed) return;

        try {
            await reservasService.cancel(reservationId);

            const cancelMessage = {
                id: Date.now(),
                sender: 'Canchas Romero',
                content: '🗑️ Reserva cancelada exitosamente. Si quieres, puedes crear otra nueva.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
            };

            const updatedConversations = conversations.map(conv => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), cancelMessage],
                        lastMessage: 'Reserva cancelada',
                        time: cancelMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });
            setConversations(updatedConversations);
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
        }
    };

    // Modificar reserva (volver a mostrar picker)
    const handleModifyReservation = (reservation, stage) => {
        if (!reservation?.id) return;
        
        // No permitir modificar reservas ya confirmadas
        if (stage === 'finalized') {
            const notAllowedMessage = {
                id: Date.now(),
                sender: 'Canchas Romero',
                content: '⚠️ No puedes modificar una reserva ya confirmada. Si necesitas cambiarla, primero cancela esta reserva y luego crea una nueva.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
            };
            
            const updatedConversations = conversations.map(conv => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), notAllowedMessage],
                        lastMessage: 'No se puede modificar',
                        time: notAllowedMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });
            setConversations(updatedConversations);
            return;
        }
        
        setReservationToModify(reservation.id);

        const modifyMessage = {
            id: Date.now(),
            sender: 'Canchas Romero',
            content: '✏️ Elige la nueva fecha y hora para tu reserva:',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: false,
            isBot: true,
            isReservationPicker: true,
        };

        const updatedConversations = conversations.map(conv => {
            if (conv.id === CANCHAS_ROMERO_ID) {
                const updatedConv = {
                    ...conv,
                    messages: [...(conv.messages || []), modifyMessage],
                    lastMessage: 'Modificar reserva',
                    time: modifyMessage.timestamp,
                };
                setActiveConversation(updatedConv);
                return updatedConv;
            }
            return conv;
        });
        setConversations(updatedConversations);
    };

    // Confirmar (final) reserva (solo mensaje informativo extra)
    const handleFinalizeReservation = async (reservation) => {
        if (!reservation?.id) return;
        try {
            const confirmResult = await reservasService.confirm(reservation.id);

            const finalMessage = {
                id: Date.now(),
                sender: 'Canchas Romero',
                content: `✅ Reserva confirmada definitivamente\n\n📅 Fecha: ${reservation.date}\n⏰ Hora: ${reservation.time}\n\n¡Disfruta tu partido!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
            };

            const postActionsMessage = {
                id: Date.now() + 1,
                sender: 'Canchas Romero',
                content: `Si finalmente no puedes asistir, puedes cancelar la reserva.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
                isReservationActions: true,
                reservationStage: 'finalized',
                reservation: {
                    id: reservation.id,
                    date: reservation.date,
                    time: reservation.time,
                    dateISO: reservation.dateISO,
                    status: confirmResult?.reservation?.status || 'confirmed'
                },
            };

            const updatedConversations = conversations.map(conv => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), finalMessage, postActionsMessage],
                        lastMessage: 'Reserva finalizada',
                        time: postActionsMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });
            setConversations(updatedConversations);
        } catch (error) {
            const errorMessage = {
                id: Date.now(),
                sender: 'Canchas Romero',
                content: '❌ No se pudo confirmar la reserva. Puede que el horario haya sido tomado por otro usuario.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                isBot: true,
            };
            const updatedConversations = conversations.map(conv => {
                if (conv.id === CANCHAS_ROMERO_ID) {
                    const updatedConv = {
                        ...conv,
                        messages: [...(conv.messages || []), errorMessage],
                        lastMessage: 'Error al confirmar',
                        time: errorMessage.timestamp,
                    };
                    setActiveConversation(updatedConv);
                    return updatedConv;
                }
                return conv;
            });
            setConversations(updatedConversations);
        }
    };

    const value = {
        activeConversation,
        setActiveConversation,
        conversations,
        setConversations,
        isMobile,
        showChatList,
        setShowChatList,
        handleSelectContact,
        handleSendMessage,
        handleDeleteMessage,
        handleDeselectContact,
        handleOpenReservationPicker,
        handleConfirmReservation,
        handleCancelReservation,
        handleModifyReservation,
        handleFinalizeReservation,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};