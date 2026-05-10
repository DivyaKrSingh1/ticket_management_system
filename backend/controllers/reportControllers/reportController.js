const { Ticket } = require('../../models/Ticket');   // ← Add { }

const getReports = async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const resolvedTickets = await Ticket.countDocuments({ status: 'RESOLVED' });
        const closedTickets = await Ticket.countDocuments({ status: 'CLOSED' });
        const pendingTickets = await Ticket.countDocuments({ status: { $in: ['OPEN', 'IN PROGRESS', 'ON HOLD'] } });

        // Average time to resolution
        const resolvedOnes = await Ticket.find({ resolvedAt: { $ne: null } });
        let avgResolutionTime = 0;

        if (resolvedOnes.length > 0) {
            const totalTime = resolvedOnes.reduce((sum, ticket) => {
                return sum + (ticket.resolvedAt - ticket.createdAt);
            }, 0);
            avgResolutionTime = Math.round(totalTime / resolvedOnes.length / (1000 * 60 * 60));
        }

        res.status(200).json({
            totalTickets,
            resolvedTickets,
            closedTickets,
            pendingTickets,
            avgResolutionTime: `${avgResolutionTime} hours`
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};

module.exports = { getReports };
