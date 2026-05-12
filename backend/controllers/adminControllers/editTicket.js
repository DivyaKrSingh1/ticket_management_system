const { editTicketById } = require('../../models/Ticket');

const editTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { title, description, status, assignedTo } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;

        const ticket = await editTicketById(ticketId, updateData);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket updated', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error editing ticket', error: error.message });
    }
};

module.exports = { editTicket };