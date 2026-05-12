const Ticket = require('../../models/Ticket');
const User = require('../../models/User');

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// EDIT USER DETAILS
const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// REASSIGN TICKET
const reassignTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { assignedTo } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { assignedTo },
            { new: true }
        ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket reassigned', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error reassigning ticket', error: error.message });
    }
};

// EDIT TICKET DETAILS
const editTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { title, description, status, assignedTo } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;

        const ticket = await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket updated', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error editing ticket', error: error.message });
    }
};

// ADMIN DASHBOARD STATS
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'OPEN' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'IN PROGRESS' });
        const resolvedTickets = await Ticket.countDocuments({ status: 'RESOLVED' });
        const closedTickets = await Ticket.countDocuments({ status: 'CLOSED' });

        const employees = await User.find({ role: 'employee' }).select('name email');
        const employeeStats = [];
        for (let emp of employees) {
            const assignedCount = await Ticket.countDocuments({ assignedTo: emp._id });
            const resolvedCount = await Ticket.countDocuments({ assignedTo: emp._id, status: 'RESOLVED' });
            employeeStats.push({
                name: emp.name,
                email: emp.email,
                totalAssigned: assignedCount,
                resolved: resolvedCount
            });
        }

        res.status(200).json({
            totalUsers,
            totalAdmins,
            totalEmployees,
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            employeeStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
    }
};

module.exports = { getAllUsers, updateUserRole, editUser, deleteUser, reassignTicket, editTicket, getAdminStats };
