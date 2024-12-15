const express = require('express');
const db = require('../db/database'); // Adjust the path to your database
const router = express.Router();

// Add an item to the cart
router.post('/add', (req, res) => {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || !quantity) {
        return res.status(400).json({ error: 'User ID, Item ID, and Quantity are required.' });
    }

    // Check if the item already exists in the user's cart
    db.get(`
        SELECT * FROM cart WHERE user_id = ? AND item_id = ?
    `, [userId, itemId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }

        if (row) {
            // If the item already exists, update the quantity
            db.run(`
                UPDATE cart SET quantity = quantity + ?
                WHERE user_id = ? AND item_id = ?
            `, [quantity, userId, itemId], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update cart.' });
                }
                res.json({ message: 'Item quantity updated in cart.' });
            });
        } else {
            // If the item is not in the cart, add a new record
            db.run(`
                INSERT INTO cart (user_id, item_id, quantity)
                VALUES (?, ?, ?)
            `, [userId, itemId, quantity], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to add item to cart.' });
                }
                res.json({ message: 'Item added to cart.', cartId: this.lastID });
            });
        }
    });
});

module.exports = router;