
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./server/database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// --- API ROUTES ---

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
        }
    });
});

// Register User (Admin Only - simplified checks)
app.post('/api/users', (req, res) => {
    const { username, password, flatNumber } = req.body;
    const id = uuidv4();

    db.run(`INSERT INTO users (id, username, password, role, flat_number) VALUES (?, ?, ?, ?, ?)`,
        [id, username, password, 'resident', flatNumber],
        function (err) {
            if (err) {
                return res.json({ success: false, message: 'Kullanıcı adı kullanımda olabilir.' });
            }
            res.json({ success: true });
        }
    );
});

// Get All Users (for Admin)
app.get('/api/users', (req, res) => {
    db.all(`SELECT id, username, password, flat_number as flatNumber, role FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Complaints
app.get('/api/complaints', (req, res) => {
    db.all(`SELECT * FROM complaints ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Normalize field names to match frontend expectation if needed, or update frontend
        const normalize = rows.map(r => ({
            id: r.id,
            category: r.category,
            description: r.description,
            status: r.status,
            createdAt: r.created_at,
            createdByFlat: r.flat_number,
            createdById: r.user_id
        }));
        res.json(normalize);
    });
});

// Add Complaint
app.post('/api/complaints', (req, res) => {
    const { category, description, createdByFlat, createdById } = req.body;
    const id = uuidv4();

    db.run(`INSERT INTO complaints (id, category, description, status, user_id, flat_number) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, category, description, 'Bekliyor', createdById, createdByFlat],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return the new object
            res.json({
                id, category, description, status: 'Bekliyor',
                createdAt: new Date().toISOString(),
                createdByFlat, createdById
            });
        }
    );
});

// Update Complaint Status
app.put('/api/complaints/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run(`UPDATE complaints SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Catch-all route for SPA (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
