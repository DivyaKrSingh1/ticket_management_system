const { deleteUserById } = require('../../models/User');

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await deleteUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = { deleteUser };