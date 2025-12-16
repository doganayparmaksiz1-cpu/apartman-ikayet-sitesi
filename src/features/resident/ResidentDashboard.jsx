import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiList, FiLogOut, FiSend, FiInfo } from 'react-icons/fi';

const ResidentDashboard = () => {
    const { user, logout } = useAuth();
    const { complaints, addComplaint } = useComplaints();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('new'); // new | feed

    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [msg, setMsg] = useState('');

    const categories = ['Elektrik', 'Asansör', 'Su', 'Güvenlik', 'Gürültü', 'Diğer'];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !description) {
            setMsg({ type: 'error', text: 'Kategori ve açıklama zorunludur.' });
            return;
        }

        addComplaint({
            category,
            description,
            createdByFlat: user.flatNumber,
            createdById: user.id
        });

        setMsg({ type: 'success', text: 'Şikayetiniz yöneticiye iletildi.' });
        setCategory('');
        setDescription('');

        setTimeout(() => {
            setMsg('');
            setActiveTab('feed');
        }, 1500);
    };

    const statusColors = {
        'Bekliyor': 'var(--color-warning)',
        'İnceleniyor': 'var(--color-info)',
        'Çözüldü': 'var(--color-success)',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav className="glass-panel" style={{
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: 'var(--color-secondary)',
                        padding: '8px',
                        borderRadius: '8px',
                        color: 'white',
                        display: 'flex'
                    }}>
                        <FiHome size={20} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Apartman Sakini</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'none' /* Mobile hide? */ }}>
                        Hoşgeldiniz, {user?.flatNumber}
                    </span>
                    <button onClick={handleLogout} className="btn" style={{ padding: '8px', color: 'var(--color-danger)' }}>
                        <FiLogOut size={20} />
                    </button>
                </div>
            </nav>

            <div className="container" style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Welcome Card */}
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', color: 'white' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Merhaba, {user?.flatNumber}</h2>
                    <p style={{ opacity: 0.9 }}>Apartman ile ilgili taleplerinizi buradan iletebilirsiniz.</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`btn ${activeTab === 'new' ? 'btn-primary' : 'glass-panel'}`}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        <FiPlusCircle /> Şikayet Ekle
                    </button>
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'glass-panel'}`}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        <FiList /> Apartman Gündemi
                    </button>
                </div>

                {/* Content */}
                <div className="animate-fade-in" style={{ flex: 1 }}>

                    {activeTab === 'new' && (
                        <div className="card">
                            <h3 style={{ marginBottom: '20px' }}>Yeni Şikayet Oluştur</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kategori Seçin</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: category === cat ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                                    background: category === cat ? 'hsla(var(--primary-hue), 90%, 95%, 0.5)' : 'white',
                                                    color: category === cat ? 'var(--color-primary)' : 'var(--text-main)',
                                                    fontWeight: category === cat ? '600' : '400',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Açıklama</label>
                                    <textarea
                                        className="glass-panel"
                                        rows="4"
                                        placeholder="Sorunu kısaca anlatınız..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ width: '100%', padding: '16px', borderRadius: '12px', resize: 'none', fontFamily: 'inherit' }}
                                    ></textarea>
                                </div>

                                {msg && (
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: msg.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                                        color: msg.type === 'error' ? 'red' : 'green',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <FiInfo /> {msg.text}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                                    <FiSend /> Şikayeti Gönder
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'feed' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {complaints.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <p>Henüz kayıtlı bir şikayet yok.</p>
                                </div>
                            ) : (
                                complaints.map(c => (
                                    <div key={c.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{c.category}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {new Date(c.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ marginBottom: '12px', fontSize: '1.05rem' }}>{c.description}</p>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Gönderen: <strong>{c.createdByFlat}</strong>
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                background: 'var(--bg-body)',
                                                border: `1px solid ${statusColors[c.status]}`,
                                                color: statusColors[c.status],
                                                fontWeight: '700'
                                            }}>
                                                {c.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ResidentDashboard;
