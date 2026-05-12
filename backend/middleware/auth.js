const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const token = authHeader.split(' ');  // ←  gets the token after "Bearer"
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { auth, SECRET_KEY };
