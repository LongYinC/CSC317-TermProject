const db = require('../db/database'); // Adjust the path to your database

const items = [
    { name: 'Belt', description: 'Description of Item 1', price: 19.99 },
    { name: 'Earring', description: 'Description of Item 2', price: 29.99 },
    { name: 'Hat', description: 'Description of Item 3', price: 39.99 },
    { name: 'Hoodie', description: 'Description of Item 4', price: 49.99 },
    { name: 'Jacket', description: 'Description of Item 5', price: 59.99 },
    { name: 'Long Sleeve', description: 'Description of Item 6', price: 69.99 },
    { name: 'Shoe', description: 'Description of Item 7', price: 79.99 },
    { name: 'Sock', description: 'Description of Item 8', price: 89.99 },
    { name: 'Sunglasses', description: 'Description of Item 9', price: 99.99 },
    { name: 'Sweat Shirt', description: 'Description of Item 10', price: 109.99 },
    { name: 'Tank Top', description: 'Description of Item 11', price: 119.99 },
    { name: 'T Shirt', description: 'Description of Item 12', price: 129.99 },
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