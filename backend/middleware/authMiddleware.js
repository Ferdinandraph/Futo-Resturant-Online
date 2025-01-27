const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// Middleware to authenticate users (both retaurants and customers)
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token:', token)
    
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = decoded; // Attach the user to the request object
        next();
    });
};

// Middleware specifically for restaurant authentication
const requireRestaurantAuth = (req, res, next) => {
    requireAuth(req, res, () => {
        if (req.user.role !== 'restaurant') {
            return res.status(403).json({ error: 'Access denied. Only restaurants can access this resource.' });
        }
        next();
    });
};

// Middleware specifically for customer authentication
const requireCustomerAuth = (req, res, next) => {
    requireAuth(req, res, () => {
        if (req.user.role !== 'customer') {
            return res.status(403).json({ error: 'Access denied. Only customers can access this resource.' });
        }
        next();
    });
};

module.exports = { requireAuth, requireRestaurantAuth, requireCustomerAuth };
