const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { createTicket } = require('../controllers/ticketControllers/createTicket');
const { getAllTickets, getMyTickets } = require('../controllers/ticketControllers/getTicket');
const { updateTicketStatus } = require('../controllers/ticketControllers/updateTicket');
const { deleteTicket } = require('../controllers/ticketControllers/deleteTicket');

// Employee can do these:
router.post('/ticket/create', auth, createTicket);
router.get('/ticket/listTickets', auth, getAllTickets);
router.get('/ticket/myTickets', auth, getMyTickets);

// Only Admin can do these:
router.put('/ticket/:ticketId/update', auth, adminAuth, updateTicketStatus);
router.delete('/ticket/:ticketId/delete', auth, adminAuth, deleteTicket);

module.exports = router;
