// users.js
const express = require('express');
const db = require('../db/database');
const bcrypt = require('bcrypt');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`
        INSERT INTO users (username, password) 
        VALUES (?, ?)
    `, [username, hashedPassword], function (err) {
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
        WHERE username = ?
    `, [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        res.json({ message: 'Login successful.', user });
    });
});

module.exports = router;
