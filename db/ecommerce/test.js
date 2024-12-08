const db = require('./db/database.js'); // Import the database connection

// Example: Add a new user
db.run(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
`, ['john_doe', 'password123'], function (err) {
    if (err) {
        console.error('Error inserting user:', err.message);
    } else {
        console.log('User added with ID:', this.lastID);

        // Example: Add items to the website
        db.run(`
            INSERT INTO items (name, description, price, stock)
            VALUES (?, ?, ?, ?)
        `, ['Modern Jacket', 'Stylish and sleek jacket.', 79.99, 50], function (err) {
            if (err) {
                console.error('Error adding item:', err.message);
            } else {
                console.log('Item added with ID:', this.lastID);

                // Example: Add item to user's cart
                db.run(`
                    INSERT INTO carts (user_id, item_id, quantity)
                    VALUES (?, ?, ?)
                `, [1, 1, 2], function (err) {
                    if (err) {
                        console.error('Error adding to cart:', err.message);
                    } else {
                        console.log('Item added to cart with ID:', this.lastID);

                        // Example: Query user's cart
                        db.all(`
                            SELECT items.name, items.price, carts.quantity 
                            FROM carts
                            INNER JOIN items ON carts.item_id = items.id
                            WHERE carts.user_id = ?
                        `, [1], (err, rows) => {
                            if (err) {
                                console.error('Error querying cart:', err.message);
                            } else {
                                console.log('User\'s Cart:', rows);
                            }

                            // Close the database connection after testing
                            db.close((err) => {
                                if (err) console.error('Error closing database:', err.message);
                                else console.log('Database connection closed.');
                            });
                        });
                    }
                });
            }
        });
    }
});
