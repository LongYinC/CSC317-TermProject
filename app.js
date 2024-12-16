const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const app = express();

// Session middleware setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to 'true' in production with HTTPS
}));

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/views')));

// Routes
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/cart', cartRoutes);

// Serve the root index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'index.html'));
});

// Product
app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/product/product.html'));
});

// Check if user is logged in
app.get('/isLoggedIn', (req, res) => {
    if (req.session && req.session.user) {
        console.log('Session User:', req.session.user); // Debug log
        res.json({ loggedIn: true, userId: req.session.user.id });
    } else {
        res.json({ loggedIn: false });
    }
});
// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.redirect('/');  // Redirect to home page or another page after logout
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


