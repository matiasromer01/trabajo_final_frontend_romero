import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './RegisterPage.module.css'

const RegisterPage = () => {
    const navigate = useNavigate()
    const { register, loading } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error del campo al escribir
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }))
        }
        setError('')
    }

    const validateForm = () => {
        const errors = {}
        
        // Validar nombre
        if (!formData.name) {
            errors.name = 'El nombre completo es requerido'
        } else if (formData.name.length < 3) {
            errors.name = 'El nombre debe tener al menos 3 caracteres'
        }
        
        // Validar email
        if (!formData.email) {
            errors.email = 'El correo electrónico es requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Ingresa un correo electrónico válido'
        }
        
        // Validar password
        if (!formData.password) {
            errors.password = 'La contraseña es requerida'
        } else if (formData.password.length < 8) {
            errors.password = 'La contraseña debe tener al menos 8 caracteres'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Debe contener mayúsculas, minúsculas y números'
        }
        
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        if (!validateForm()) {
            return
        }

        const result = await register(formData)
        
        if (result.success) {
            // Si el backend devuelve token, redirigir a chats
            // Si no, redirigir a login o mostrar mensaje de verificación de email
            navigate('/login')
        } else {
            setError(result.error || 'Error al registrarse. Intenta nuevamente.')
        }
    }

    return (
        <div className={styles.registerPage}>
            <div className={styles.registerHeader}>
                <h2 className={styles.registerHeaderTitle}>Crear Cuenta</h2>
                <p className={styles.registerHeaderSubtitle}>Completa el formulario para registrarte</p>
            </div>

            <div className={styles.registerContent}>
                <div className={styles.registerCard}>
                    <div className={styles.registerLogo}>
                        <div className={styles.registerLogoIcon}>
                            <svg viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className={styles.registerTitle}>Registrarse</h2>

                    {error && (
                        <div className={styles.errorMessage}>
                            <i className="bi bi-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <form className={styles.registerForm} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre completo"
                                value={formData.name}
                                onChange={handleChange}
                                className={`${styles.registerInput} ${fieldErrors.name ? styles.inputError : ''}`}
                                disabled={loading}
                            />
                            {fieldErrors.name && (
                                <span className={styles.fieldError}>{fieldErrors.name}</span>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                className={`${styles.registerInput} ${fieldErrors.email ? styles.inputError : ''}`}
                                disabled={loading}
                            />
                            {fieldErrors.email && (
                                <span className={styles.fieldError}>{fieldErrors.email}</span>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                className={`${styles.registerInput} ${fieldErrors.password ? styles.inputError : ''}`}
                                disabled={loading}
                            />
                            {fieldErrors.password && (
                                <span className={styles.fieldError}>{fieldErrors.password}</span>
                            )}
                        </div>

                        <button type="submit" className={styles.registerButton} disabled={loading}>
                            {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                        </button>

                        <p className={styles.registerText}>
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión.</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
