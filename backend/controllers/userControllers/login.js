const { getUserByEmail, comparePassword } = require('../../models/User');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../middleware/auth');

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user using model function
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password using model function
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { login };
