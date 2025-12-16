
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new sqlite3.Database('./server/database.sqlite', (err) => {
    if (err) {
        console.error('Veritabanı açılamadı:', err.message);
    } else {
        console.log('Veritabanına bağlanıldı.');
    }
});

db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    flat_number TEXT
  )`);

    // Complaints Table
    db.run(`CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    category TEXT,
    description TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    flat_number TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

    // Seed Admin
    const adminId = uuidv4();
    db.run(`INSERT OR IGNORE INTO users (id, username, password, role, flat_number) VALUES (?, ?, ?, ?, ?)`,
        [adminId, 'admin', '123', 'admin', 'Yönetim'],
        (err) => {
            if (err) console.error("Admin eklenirken hata:", err.message);
            else console.log("Admin kullanıcısı hazır (veya zaten var).");
        }
    );
});

db.close((err) => {
    if (err) console.error(err.message);
    console.log('Kurulum tamamlandı.');
});
