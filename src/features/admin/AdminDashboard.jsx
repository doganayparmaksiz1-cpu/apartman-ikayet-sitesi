import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiLogOut, FiPlus, FiCheck, FiX, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user, logout, registerUser, getAllUsers } = useAuth();
    const { complaints, updateStatus } = useComplaints();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('complaints'); // complaints | users

    // Register User State
    const [newUser, setNewUser] = useState({ username: '', password: '', flatNumber: '' });
    const [msg, setMsg] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!newUser.username || !newUser.password || !newUser.flatNumber) {
            setMsg({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
            return;
        }
        const res = registerUser(newUser);
        if (res.success) {
            setMsg({ type: 'success', text: 'Kullanıcı başarıyla oluşturuldu.' });
            setNewUser({ username: '', password: '', flatNumber: '' });
        } else {
            setMsg({ type: 'error', text: res.message });
        }
        setTimeout(() => setMsg(''), 3000);
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
                        background: 'var(--color-primary)',
                        padding: '8px',
                        borderRadius: '8px',
                        color: 'white',
                        display: 'flex'
                    }}>
                        <FiActivity size={20} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Yönetici Paneli</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Sn. {user?.flatNumber}
                    </span>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        <FiLogOut /> Çıkış
                    </button>
                </div>
            </nav>

            <div className="container" style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => setActiveTab('complaints')}
                        className={`btn ${activeTab === 'complaints' ? 'btn-primary' : 'glass-panel'}`}
                        style={{ flex: 1, justifyContent: 'center', opacity: activeTab === 'complaints' ? 1 : 0.7 }}
                    >
                        <FiFileText /> Şikayet Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`btn ${activeTab === 'users' ? 'btn-primary' : 'glass-panel'}`}
                        style={{ flex: 1, justifyContent: 'center', opacity: activeTab === 'users' ? 1 : 0.7 }}
                    >
                        <FiUsers /> Daire & Kullanıcı Yönetimi
                    </button>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in" style={{ flex: 1 }}>

                    {activeTab === 'complaints' && (
                        <div className="card" style={{ minHeight: '400px' }}>
                            <h2 style={{ marginBottom: '24px' }}>Gelen Şikayetler</h2>

                            {complaints.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <FiCheck size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                    <p>Harika! Henüz hiç şikayet yok.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {complaints.map(c => (
                                        <div key={c.id} style={{
                                            border: '1px solid #eee',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            background: 'var(--bg-body)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        background: 'var(--bg-card)',
                                                        border: '1px solid #ddd',
                                                        fontWeight: '600',
                                                        marginBottom: '8px'
                                                    }}>
                                                        {c.category}
                                                    </span>
                                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{c.description}</h3>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                        Daire: <strong>{c.createdByFlat}</strong> • {new Date(c.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div style={{ minWidth: '150px' }}>
                                                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Durum</label>
                                                    <select
                                                        value={c.status}
                                                        onChange={(e) => updateStatus(c.id, e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: `2px solid ${statusColors[c.status] || '#ccc'}`,
                                                            fontWeight: '600',
                                                            color: 'var(--text-main)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <option value="Bekliyor">Bekliyor</option>
                                                        <option value="İnceleniyor">İnceleniyor</option>
                                                        <option value="Çözüldü">Çözüldü</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Add User */}
                            <div className="card">
                                <h2 style={{ marginBottom: '20px' }}>Yeni Sakin Ekle</h2>
                                <form onSubmit={handleRegister}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Daire No / İsim</label>
                                        <input
                                            className="glass-panel"
                                            type="text"
                                            placeholder="Örn: Daire 5"
                                            value={newUser.flatNumber}
                                            onChange={e => setNewUser({ ...newUser, flatNumber: e.target.value })}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Kullanıcı Adı</label>
                                        <input
                                            className="glass-panel"
                                            type="text"
                                            placeholder="kullaniciadi"
                                            value={newUser.username}
                                            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Şifre</label>
                                        <input
                                            className="glass-panel"
                                            type="text"
                                            placeholder="şifre"
                                            value={newUser.password}
                                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                                        />
                                    </div>

                                    {msg && (
                                        <div style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            background: msg.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                                            color: msg.type === 'error' ? 'red' : 'green',
                                            marginBottom: '16px'
                                        }}>
                                            {msg.text}
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                        <FiPlus /> Kullanıcı Oluştur
                                    </button>
                                </form>
                            </div>

                            {/* User List */}
                            <div className="card">
                                <h2 style={{ marginBottom: '20px' }}>Kayıtlı Sakinler</h2>
                                <UserList />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserList = () => {
    const { getAllUsers } = useAuth();
    const [users, setUsers] = useState([]);

    React.useEffect(() => {
        getAllUsers().then(data => setUsers(data));
    }, []);

    // Poll for updates (simplified)
    React.useEffect(() => {
        const interval = setInterval(() => {
            getAllUsers().then(data => setUsers(data));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const residents = users.filter(u => u.role !== 'admin');

    if (residents.length === 0) {
        return <p style={{ color: 'var(--text-muted)' }}>Henüz kayıtlı sakin yok.</p>;
    }

    return (
        <div style={{ display: 'grid', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
            {residents.map((u, i) => (
                <div key={i} style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <strong style={{ fontSize: '1.1rem' }}>{u.flatNumber}</strong>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Şifre: ***</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;
