
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getReports } = require('../controllers/reportControllers/reportController');

// GET /api/report/summary
router.get('/report/summary', auth, getReports);

module.exports = router;
