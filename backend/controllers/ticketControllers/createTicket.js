const { findEmployeeWithLowestTickets, createNewTicket } = require('../../models/Ticket');
const { getAllUsers } = require('../../models/User');

// CREATE TICKET (Auto-assign to employee with lowest ticket count)
const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Find all employees
        const employees = await getAllUsers();

        // Find employee with lowest ticket count
        const assignedEmployee = await findEmployeeWithLowestTickets(employees);

        // Create ticket
        const ticket = await createNewTicket({
            title,
            description,
            createdBy: req.user.id,
            assignedTo: assignedEmployee ? assignedEmployee._id : null
        });

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
};

module.exports = { createTicket };
