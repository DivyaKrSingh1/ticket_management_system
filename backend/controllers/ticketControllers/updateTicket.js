const { getTicketById, updateTicket } = require('../../models/Ticket');

// UPDATE TICKET STATUS
const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status, resolutionNote } = req.body;

        // Find ticket using model function
        const ticket = await getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Block resolution without a note
        if (status === 'RESOLVED' && !resolutionNote) {
            return res.status(400).json({ message: 'Resolution note is required to resolve a ticket' });
        }

        // Update ticket using model function
        const updatedTicket = await updateTicket(ticket, { status, resolutionNote });

        res.status(200).json({
            message: 'Ticket status updated successfully',
            ticket: updatedTicket
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
};

module.exports = { updateTicketStatus };
