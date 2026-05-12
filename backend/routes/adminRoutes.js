const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { getAdminStats } = require('../controllers/adminControllers/getAdminStats');
const { getAllUsers } = require('../controllers/adminControllers/getAllUsers');
const { updateUserRole } = require('../controllers/adminControllers/updateUserRole');
const { editUser } = require('../controllers/adminControllers/editUser');
const { deleteUser } = require('../controllers/adminControllers/deleteUser');
const { reassignTicket } = require('../controllers/adminControllers/reassignTicket');
const { editTicket } = require('../controllers/adminControllers/editTicket');

// All admin routes require auth + adminAuth
router.get('/admin/stats', auth, adminAuth, getAdminStats);
router.get('/admin/users', auth, adminAuth, getAllUsers);
router.put('/admin/user/:userId/role', auth, adminAuth, updateUserRole);
router.put('/admin/user/:userId/edit', auth, adminAuth, editUser);
router.delete('/admin/user/:userId/delete', auth, adminAuth, deleteUser);
router.put('/admin/ticket/:ticketId/reassign', auth, adminAuth, reassignTicket);
router.put('/admin/ticket/:ticketId/edit', auth, adminAuth, editTicket);

module.exports = router;