const db = require('../db/database'); // Adjust the path to your database

const items = [
    { name: 'Item 1', description: 'Description of Item 1', price: 19.99 },
    { name: 'Item 2', description: 'Description of Item 2', price: 29.99 },
    { name: 'Item 3', description: 'Description of Item 3', price: 39.99 },
    { name: 'Item 4', description: 'Description of Item 4', price: 49.99 },
    { name: 'Item 5', description: 'Description of Item 5', price: 59.99 },
    { name: 'Item 6', description: 'Description of Item 6', price: 69.99 },
    { name: 'Item 7', description: 'Description of Item 7', price: 79.99 },
    { name: 'Item 8', description: 'Description of Item 8', price: 89.99 },
    { name: 'Item 9', description: 'Description of Item 9', price: 99.99 },
    { name: 'Item 10', description: 'Description of Item 10', price: 109.99 },
    { name: 'Item 11', description: 'Description of Item 11', price: 119.99 },
    { name: 'Item 12', description: 'Description of Item 12', price: 129.99 },
];

// Insert each item into the database
items.forEach(item => {
    db.run(`
        INSERT INTO items (name, description, price)
        VALUES (?, ?, ?)
    `, [item.name, item.description, item.price], function(err) {
        if (err) {
            console.error('Error inserting item:', err);
        } else {
            console.log(`Item inserted: ${item.name}`);
        }
    });
});