const { getTicketsByFilter, getTicketsByUserId } = require('../../models/Ticket');

// GET ALL TICKETS (with filters)
const getAllTickets = async (req, res) => {
    try {
        const { status, employeeName } = req.query;

        let filter = {};
        if (status) filter.status = status;

        let tickets = await getTicketsByFilter(filter);

        // Filter by employee name if provided
        if (employeeName) {
            tickets = tickets.filter(t =>
                t.assignedTo && t.assignedTo.name.toLowerCase().includes(employeeName.toLowerCase())
            );
        }

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

// GET MY TICKETS
const getMyTickets = async (req, res) => {
    try {
        const tickets = await getTicketsByUserId(req.user.id);
        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};


module.exports = { getAllTickets, getMyTickets };
