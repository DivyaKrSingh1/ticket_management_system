const { getUserByEmail, createUser } = require('../../models/User');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../middleware/auth');

// Main function to handle user sign up
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already associated with another user' });
        }

        // Create new employee (password hashing handled in model pre-save hook)
        const user = await createUser( name, email, password );

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Employee created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

module.exports = { signup };
