const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'ticket_management_secret_2026';

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const token = authHeader.substring(7);
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

module.exports = { auth, SECRET_KEY };
