const { reassignTicketById } = require('../../models/Ticket');

const reassignTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { assignedTo } = req.body;

        const ticket = await reassignTicketById(ticketId, assignedTo);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket reassigned', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error reassigning ticket', error: error.message });
    }
};

module.exports = { reassignTicket };