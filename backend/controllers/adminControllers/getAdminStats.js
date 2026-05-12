const { getTicketStats, getEmployeeTicketStats } = require('../../models/Ticket');
const { getUserStats, getEmployees } = require('../../models/User');

const getAdminStats = async (req, res) => {
    try {
        const { totalUsers, totalAdmins, totalEmployees } = await getUserStats();
        const { totalTickets, openTickets, inProgressTickets, resolvedTickets, closedTickets } = await getTicketStats();
        const employees = await getEmployees();
        const employeeStats = await getEmployeeTicketStats(employees);

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

module.exports = { getAdminStats };