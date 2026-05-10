const { getTicketById } = require('../../models/Ticket');

// DELETE TICKET
const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await ticket.deleteOne();
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error: error.message });
    }
};

module.exports = { deleteTicket };
