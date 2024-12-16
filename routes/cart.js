const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Add an item to the cart
router.post('/', (req, res) => {
    const { username, itemName, quantity } = req.body;

    console.log('Add to Cart Request:', { userId, itemId, quantity }); // Debug log

    db.run(
        `
            INSERT INTO carts (user_id, item_id, quantity)
            VALUES (?, ?, ?)
        `,
        [userId, itemId, quantity],
        function (err) {
            if (err) {
                console.error('Database Error (Add Item):', err.message); // Debug log
                return res.status(500).json({ error: 'Failed to add item to cart.' });
            }
            console.log('Item added to cart with ID:', this.lastID); // Debug log
            res.json({ message: 'Item added to cart.', cartId: this.lastID });
        }
    );
});

// Update item quantity in the cart
router.post('/update', (req, res) => {
    const { username, itemName, quantity } = req.body;

    console.log('Update Cart Request:', { username, itemName, quantity }); // Debug log

    // Look up the userId based on username
    db.get(`
        SELECT id FROM users WHERE username = ?
    `, [username], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'Failed to find user.' });
        }

        // Look up the itemId based on itemName
        db.get(`
            SELECT id FROM items WHERE name = ?
        `, [itemName], (err, item) => {
            if (err || !item) {
                return res.status(500).json({ error: 'Failed to find item.' });
            }

            const userId = user.id;
            const itemId = item.id;

            // Update the item quantity in the cart
            db.run(`
                UPDATE carts
                SET quantity = ?
                WHERE user_id = ? AND item_id = ?
            `, [quantity, userId, itemId], function (err) {
                if (err) {
                    console.error('Database Error (Update Quantity):', err.message); // Debug log
                    return res.status(500).json({ error: 'Failed to update item quantity.' });
                }
                console.log('Quantity updated successfully for itemId:', itemId); // Debug log
                res.json({ success: true, message: 'Quantity updated successfully.' });
            });
        });
    });
});

// Remove an item from the cart
router.post('/remove', (req, res) => {
    const { username, itemName } = req.body;

    console.log('Remove Item Request:', { username, itemName }); // Debug log

    // Look up the userId based on username
    db.get(`
        SELECT id FROM users WHERE username = ?
    `, [username], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'Failed to find user.' });
        }

        // Look up the itemId based on itemName
        db.get(`
            SELECT id FROM items WHERE name = ?
        `, [itemName], (err, item) => {
            if (err || !item) {
                return res.status(500).json({ error: 'Failed to find item.' });
            }

            const userId = user.id;
            const itemId = item.id;

            // Delete the item from the cart
            db.run(`
                DELETE FROM carts
                WHERE user_id = ? AND item_id = ?
            `, [userId, itemId], function (err) {
                if (err) {
                    console.error('Database Error (Remove Item):', err.message); // Debug log
                    return res.status(500).json({ error: 'Failed to remove item from cart.' });
                }
                console.log('Item removed successfully:', itemId); // Debug log
                res.json({ success: true, message: 'Item removed from cart.' });
            });
        });
    });
});

// Fetch user's cart for checkout
router.get('/checkout/:username', (req, res) => {
    const { username } = req.params;

    console.log('Fetch Cart for User:', username); // Debug log

    db.get(`
        SELECT id FROM users WHERE username = ?
    `, [username], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'Failed to find user.' });
        }

        const userId = user.id;

        db.all(`
            SELECT items.id as itemId, items.name, items.price, carts.quantity, 
                   (items.price * carts.quantity) AS totalPrice
            FROM carts
            INNER JOIN items ON carts.item_id = items.id
            WHERE carts.user_id = ?
        `, [userId], (err, rows) => {
            if (err) {
                console.error('Database Error (Fetch Cart):', err.message); // Debug log
                return res.status(500).json({ error: 'Failed to retrieve cart for checkout.' });
            }

            const grandTotal = rows.reduce((sum, item) => sum + item.totalPrice, 0);
            console.log('Cart items retrieved:', rows); // Debug log

            res.json({
                cartItems: rows,
                grandTotal,
            });
        });
    });
});

router.get('/isLoggedIn', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user.username });  // Send username back
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;