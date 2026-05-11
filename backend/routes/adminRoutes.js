const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const {
    getAllUsers,
    updateUserRole,
    editUser,
    deleteUser,
    reassignTicket,
    editTicket,
    getAdminStats
} = require('../controllers/adminControllers/adminController');

// All admin routes require auth + adminAuth
router.get('/admin/stats', auth, adminAuth, getAdminStats);
router.get('/admin/users', auth, adminAuth, getAllUsers);
router.put('/admin/user/:userId/role', auth, adminAuth, updateUserRole);
router.put('/admin/user/:userId/edit', auth, adminAuth, editUser);
router.delete('/admin/user/:userId/delete', auth, adminAuth, deleteUser);
router.put('/admin/ticket/:ticketId/reassign', auth, adminAuth, reassignTicket);
router.put('/admin/ticket/:ticketId/edit', auth, adminAuth, editTicket);

module.exports = router;
