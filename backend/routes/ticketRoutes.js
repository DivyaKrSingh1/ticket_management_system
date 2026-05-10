

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createTicket } = require('../controllers/ticketControllers/createTicket');
const { getAllTickets, getMyTickets } = require('../controllers/ticketControllers/getTicket');
const { updateTicketStatus } = require('../controllers/ticketControllers/updateTicket');
const { deleteTicket } = require('../controllers/ticketControllers/deleteTicket');

//  Create a new ticket
router.post('/ticket/create', auth, createTicket);

// Get all tickets (with optional filters ?status=Open&assignedTo=userId)
router.get('/ticket/listTickets', auth, getAllTickets);

// Get my assigned tickets
router.get('/ticket/myTickets', auth, getMyTickets);

// Update ticket 
router.put('/ticket/:ticketId/update', auth, updateTicketStatus);

// Delete a ticket
router.delete('/ticket/:ticketId/delete', auth, deleteTicket);

module.exports = router;

