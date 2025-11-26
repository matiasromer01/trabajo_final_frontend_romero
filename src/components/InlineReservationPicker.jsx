import React, { useState, useEffect } from 'react';
import canchasService from '../services/canchas.service';
import styles from './InlineReservationPicker.module.css';

const InlineReservationPicker = ({ onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [ocupados, setOcupados] = useState([]);
    const [loading, setLoading] = useState(false);

    // Horarios disponibles
    const availableTimes = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

    // Obtener fecha mínima
    const today = new Date().toISOString().split('T')[0];

    // Obtener fecha máxima (hasta 30)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    // Consultar horarios ocupados cuando cambia la fecha
    useEffect(() => {
        const fetchOcupados = async () => {
            if (!selectedDate) {
                setOcupados([]);
                return;
            }

            setLoading(true);
            try {
                // Llamar a la API para obtener disponibilidad
                const response = await canchasService.getAvailability(1, selectedDate); // canchaId: 1
                // Se espera que el backend devuelva: { ocupados: ['18:00', '20:00'] }
                setOcupados(response.ocupados || []);
            } catch (error) {
                console.error('Error al obtener disponibilidad:', error);
                setOcupados([]); // En caso de error, mostrar todos disponibles
            } finally {
                setLoading(false);
            }
        };

        fetchOcupados();
    }, [selectedDate]);

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            // Validar que la fecha no sea anterior a hoy
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            const [year, month, day] = selectedDate.split('-');
            const selectedDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            
            if (selectedDateObj < todayDate) {
                onConfirm({
                    error: true,
                    message: '❌ No puedes reservar en una fecha pasada. Por favor, selecciona una fecha válida.'
                });
                return;
            }
            
            const formattedDate = `${day}/${month}/${year}`;
            
            onConfirm({
                date: formattedDate,
                time: selectedTime,
                dateISO: selectedDate,
            });
        }
    };

    return (
        <div className={styles.picker}>
            <div className={styles.dateSection}>
                <label className={styles.label}>📅 Fecha:</label>
                <input
                    type="date"
                    className={styles.dateInput}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={today}
                    max={maxDateStr}
                />
            </div>

            <div className={styles.timeSection}>
                <label className={styles.label}>⏰ Horario:</label>
                <div className={styles.timeGrid}>
                    {loading ? (
                        <div className={styles.loadingText}>Cargando disponibilidad...</div>
                    ) : (
                        availableTimes.map((time) => {
                            const isOcupado = ocupados.includes(time);
                            return (
                                <button
                                    key={time}
                                    className={`${styles.timeButton} ${
                                        selectedTime === time ? styles.selected : ''
                                    } ${isOcupado ? styles.disabled : ''}`}
                                    onClick={() => !isOcupado && setSelectedTime(time)}
                                    disabled={isOcupado}
                                >
                                    {time} {isOcupado && '🔒'}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {selectedDate && selectedTime && (
                <button
                    className={styles.confirmButton}
                    onClick={handleConfirm}
                >
                    ✅ Confirmar reserva
                </button>
            )}
        </div>
    );
};

export default InlineReservationPicker;
