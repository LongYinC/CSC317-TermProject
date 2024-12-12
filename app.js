// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');
const cors = require('cors'); // Enable CORS
const path = require('path'); // Required for serving static files
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/cart', cartRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Serve the default index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
