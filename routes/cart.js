// cart.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Add an item to the cart
router.post('/', (req, res) => {
    const { userId, itemId, quantity } = req.body;
    db.run(`
        INSERT INTO carts (user_id, item_id, quantity) 
        VALUES (?, ?, ?)
    `, [userId, itemId, quantity], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to add item to cart.' });
        }
        res.json({ message: 'Item added to cart.', cartId: this.lastID });
    });
});

// Get user's cart
router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    db.all(`
        SELECT items.name, items.price, carts.quantity 
        FROM carts
        INNER JOIN items ON carts.item_id = items.id
        WHERE carts.user_id = ?
    `, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve cart.' });
        }
        res.json(rows);
    });
});

module.exports = router;
