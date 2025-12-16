import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage only for session persistence in UI
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, role: data.user.role };
            }
            return { success: false, message: data.message };
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            return { success: false, message: 'Sunucuya bağlanılamadı. Backend açık mı?' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const registerUser = async (newUser) => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return { success: false, message: 'Sunucu hatası.' };
        }
    };

    const getAllUsers = async () => {
        try {
            const res = await fetch('/api/users');
            return await res.json();
        } catch (err) {
            return [];
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, registerUser, getAllUsers }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
