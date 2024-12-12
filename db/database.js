c// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt'); // Secure passwords

// Connect to or create the database
const db = new sqlite3.Database(path.join(__dirname, '../ecommerce.db'), (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    // Items table
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL
            )
    `);

    // Carts table
    db.run(`
        CREATE TABLE IF NOT EXISTS carts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (item_id) REFERENCES items (id)
            )
    `);
});

module.exports = db;


