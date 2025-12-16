import React, { createContext, useContext, useState, useEffect } from 'react';

const ComplaintContext = createContext();

export const useComplaints = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/complaints');
            const data = await res.json();
            setComplaints(data);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
        }
    };

    useEffect(() => {
        fetchComplaints();
        // Poll every 5 seconds to mock real-time updates for now
        const interval = setInterval(fetchComplaints, 5000);
        return () => clearInterval(interval);
    }, []);

    const addComplaint = async (complaint) => {
        try {
            const res = await fetch('http://localhost:3000/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complaint)
            });
            const newComplaint = await res.json();
            setComplaints(prev => [newComplaint, ...prev]);
            return newComplaint;
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`http://localhost:3000/api/complaints/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            setComplaints(prev => prev.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const getComplaintsByFlat = (flatNumber) => {
        return complaints.filter(c => c.createdByFlat === flatNumber);
    };

    return (
        <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus, getComplaintsByFlat }}>
            {children}
        </ComplaintContext.Provider>
    );
};
