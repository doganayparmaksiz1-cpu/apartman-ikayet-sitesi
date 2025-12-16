import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/resident');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for effect
        setTimeout(() => {
            const result = login(username, password);
            if (result.success) {
                navigate(result.role === 'admin' ? '/admin' : '/resident');
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="card glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', position: 'relative', overflow: 'hidden' }}>

                {/* Decorative circle */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                    opacity: '0.1'
                }} />

                <div style={{ padding: '24px 12px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'white',
                            fontSize: '24px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <FiUser />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Hoşgeldiniz</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Apartman Yönetim Sistemine Giriş Yapın</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>Kullanıcı Adı</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px solid transparent',
                                        background: 'var(--bg-body)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: 'var(--text-main)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>Şifre</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px solid transparent',
                                        background: 'var(--bg-body)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: 'var(--text-main)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                marginBottom: '20px',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255, 50, 50, 0.1)',
                                color: 'var(--color-danger)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.9rem'
                            }}>
                                <FiAlertCircle />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                            {!isLoading && <FiArrowRight />}
                        </button>
                    </form>
                </div>
            </div>

            <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Varsayılan Yönetici: <strong>admin</strong> / <strong>123</strong>
            </p>
        </div>
    );
};

export default LoginPage;
