const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run(`
        INSERT INTO users (username, password) 
        VALUES (?, ?)
    `, [username, password], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to register user.' });
        }
        res.json({ message: 'User registered successfully.', userId: this.lastID });
    });
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`
        SELECT * FROM users 
        WHERE username = ? AND password = ?
    `, [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        res.json({ message: 'Login successful.', user });
    });
});

module.exports = router;
