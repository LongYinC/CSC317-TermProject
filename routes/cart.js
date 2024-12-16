const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Add an item to the cart
router.post('/', (req, res) => {
    const { username, itemName, quantity } = req.body;

    // Validate input
    if (!username || !itemName || !quantity) {
        console.error('Missing fields in Add to Cart Request:', { username, itemName, quantity });
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    console.log('Add to Cart Request:', { username, itemName, quantity }); // Debug log

    // First, get the user ID
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Then, get the item ID
        db.get('SELECT id FROM items WHERE name = ?', [itemName], (err, item) => {
            if (err || !item) {
                return res.status(404).json({ error: 'Item not found.' });
            }

            // Insert into cart using IDs
            db.run(
                `
                INSERT INTO carts (user_id, item_id, quantity)
                VALUES (?, ?, ?)
                `,
                [user.id, item.id, quantity],
                function (err) {
                    if (err) {
                        console.error('Database Error (Add Item):', err.message);
                        return res.status(500).json({ error: 'Failed to add item to cart.' });
                    }
                    console.log('Item added to cart with ID:', this.lastID);
                    res.json({ message: 'Item added to cart.', cartId: this.lastID });
                }
            );
        });
    });
});

// Update item quantity in the cart
router.post('/update', (req, res) => {
    const { username, itemName, quantity } = req.body;

    // Validate input
    if (!username || !itemName || !quantity) {
        console.error('Missing fields in Update Cart Request:', { username, itemName, quantity });
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    console.log('Update Cart Request:', { username, itemName, quantity }); // Debug log

    // First, get the user ID
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Then, get the item ID
        db.get('SELECT id FROM items WHERE name = ?', [itemName], (err, item) => {
            if (err || !item) {
                return res.status(404).json({ error: 'Item not found.' });
            }

            db.run(
                `
                UPDATE carts
                SET quantity = ?
                WHERE user_id = ? AND item_id = ?
                `,
                [quantity, user.id, item.id],
                function (err) {
                    if (err) {
                        console.error('Database Error (Update Quantity):', err.message);
                        return res.status(500).json({ error: 'Failed to update item quantity.' });
                    }
                    console.log('Quantity updated successfully for itemName:', itemName);
                    res.json({ success: true, message: 'Quantity updated successfully.' });
                }
            );
        });
    });
});

// Remove an item from the cart
router.post('/remove', (req, res) => {
    const { username, itemName } = req.body;

    // Validate input
    if (!username || !itemName) {
        console.error('Missing fields in Remove Item Request:', { username, itemName });
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    console.log('Remove Item Request:', { username, itemName }); // Debug log

    // First, get the user ID
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Then, get the item ID
        db.get('SELECT id FROM items WHERE name = ?', [itemName], (err, item) => {
            if (err || !item) {
                return res.status(404).json({ error: 'Item not found.' });
            }

            db.run(
                `
                DELETE FROM carts
                WHERE user_id = ? AND item_id = ?
                `,
                [user.id, item.id],
                function (err) {
                    if (err) {
                        console.error('Database Error (Remove Item):', err.message);
                        return res.status(500).json({ error: 'Failed to remove item from cart.' });
                    }
                    console.log('Item removed successfully:', itemName);
                    res.json({ success: true, message: 'Item removed from cart.' });
                }
            );
        });
    });
});

// Fetch user's cart for checkout
router.get('/checkout/:username', (req, res) => {
    const { username } = req.params;

    // Validate input
    if (!username) {
        console.error('Missing username in Fetch Cart Request.');
        return res.status(400).json({ error: 'Username is required for checkout.' });
    }

    console.log('Fetch Cart for User:', username); // Debug log

    db.all(
        `
        SELECT 
            items.name, 
            items.price, 
            carts.quantity, 
            (items.price * carts.quantity) AS totalPrice
        FROM carts
        INNER JOIN users ON carts.user_id = users.id
        INNER JOIN items ON carts.item_id = items.id
        WHERE users.username = ?
        `,
        [username],
        (err, rows) => {
            if (err) {
                console.error('Database Error (Fetch Cart):', err.message);
                return res.status(500).json({ error: 'Failed to retrieve cart for checkout.' });
            }

            const grandTotal = rows.length
                ? rows.reduce((sum, item) => sum + item.totalPrice, 0)
                : 0;

            console.log('Cart items retrieved:', rows);
            res.json({
                cartItems: rows,
                grandTotal,
            });
        }
    );
});

module.exports = router;