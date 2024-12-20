const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Add a new item
router.post('/', (req, res) => {
    const { name, description, price } = req.body;
    db.run(`
        INSERT INTO items (name, description, price)
        VALUES (?, ?, ?)
    `, [name, description, price], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to add item.' });
        }
        res.json({ message: 'Item added successfully.', itemId: this.lastID });
    });
});

// Get all items
router.get('/', (req, res) => {
    db.all(`SELECT * FROM items`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve items.' });
        }
        res.json(rows);
    });
});

// Get item by name
router.get('/name/:name', (req, res) => {
    const { name } = req.params;
    db.get(`SELECT * FROM items WHERE name = ?`, [name], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve the item.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.json(row);
    });
});

module.exports = router;