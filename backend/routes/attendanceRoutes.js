const express = require('express');

const router = express.Router();

const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

const {
  markAttendance,
} = require('../controllers/attendanceControllers/markAttendance');

const {
  getAttendanceByDate,
} = require('../controllers/attendanceControllers/getAttendanceByDate');

const {
  getEmployeeAttendance,
} = require('../controllers/attendanceControllers/getEmployeeAttendance');

const {
  getWarehouseEmployees,
} = require('../controllers/attendanceControllers/getWarehouseEmployees');

// MARK ATTENDANCE
router.post(
  '/mark',
  auth,
  adminAuth,
  markAttendance
);

// GET ATTENDANCE BY DATE
router.get(
  '/date',
  auth,
  adminAuth,
  getAttendanceByDate
);

// GET EMPLOYEE ATTENDANCE REPORT
router.get(
  '/employee/:id',
  auth,
  adminAuth,
  getEmployeeAttendance
);

// GET WAREHOUSE EMPLOYEES
router.get(
  '/warehouse-employees',
  auth,
  adminAuth,
  getWarehouseEmployees
);

module.exports = router;