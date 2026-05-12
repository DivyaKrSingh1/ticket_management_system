const { getUserByEmail } = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const SECRET_KEY = process.env.SECRET_KEY || 'ticket_management_secret_2026';

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Employee created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

module.exports = { signup };
