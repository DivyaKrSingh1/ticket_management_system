const { editUserById } = require('../../models/User');

const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email } = req.body;

        const user = await editUserById(userId, name, email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

module.exports = { editUser };