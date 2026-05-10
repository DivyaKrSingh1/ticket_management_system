const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED', 'ON HOLD', 'REOPENED'],
    default: 'OPEN'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionNote: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

// Function to get ticket count for an employee (excluding CLOSED)
const getActiveTicketCount = async (employeeId) => {
    const count = await Ticket.countDocuments({
        assignedTo: employeeId,
        status: { $nin: ['CLOSED'] }
    });
    return count;
};

// Function to find employee with lowest ticket count
const findEmployeeWithLowestTickets = async (employees) => {
    let minTicketCount = Infinity;
    let assignedEmployee = null;

    for (let emp of employees) {
        const ticketCount = await getActiveTicketCount(emp._id);
        if (ticketCount < minTicketCount) {
            minTicketCount = ticketCount;
            assignedEmployee = emp;
        }
    }
    return assignedEmployee;
};

// Function to create a new ticket
const createNewTicket = async ({ title, description, createdBy, assignedTo }) => {
    const ticket = new Ticket({
        title,
        description,
        createdBy,
        assignedTo
    });
    await ticket.save();
    return ticket;
};

// Function to get tickets with filter (populated)
const getTicketsByFilter = async (filter) => {
    const tickets = await Ticket.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    return tickets;
};

// Function to get tickets assigned to a specific user
const getTicketsByUserId = async (userId) => {
    const tickets = await Ticket.find({ assignedTo: userId })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
        console.log('tickets',tickets);
        
    return tickets;
};

// Function to find ticket by ID
const getTicketById = async (ticketId) => {
    const ticket = await Ticket.findById(ticketId);
    return ticket;
};

// Function to update ticket status
const updateTicket = async (ticket, { status, resolutionNote }) => {
    ticket.status = status;
    if (status === 'RESOLVED') {
        ticket.resolutionNote = resolutionNote;
        ticket.resolvedAt = new Date();
    }
    await ticket.save();
    return ticket;
};

module.exports = {
    Ticket,
    getActiveTicketCount,
    findEmployeeWithLowestTickets,
    createNewTicket,
    getTicketsByFilter,
    getTicketsByUserId,
    getTicketById,
    updateTicket
};
