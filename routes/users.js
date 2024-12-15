const express = require('express');
const db = require('../db/database');
const bcrypt = require('bcrypt');
const session = require('express-session');
const router = express.Router();


// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `, [username, hashedPassword], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user.' });
            }
            res.redirect('/login.html'); // Redirect on successful registration
        });
    } catch (err) {
        console.error('Hashing error:', err);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// User login
router.post('/login', async (req, res) => {
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

        // Store the user in the session after successful login
        req.session.user = user;  // Save user data to session

        // Redirect to the shop page or return a response indicating success
        res.redirect('/shop.html'); // Change this to where you want to redirect after login
    });
});




module.exports = router;
