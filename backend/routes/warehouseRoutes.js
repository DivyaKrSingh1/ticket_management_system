const express = require('express');

const router = express.Router();

const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

const {
  createWarehouseController,
} = require('../controllers/warehouseControllers/createWarehouse');

const {
  getWarehousesController,
} = require('../controllers/warehouseControllers/getWarehouses');

const {
  updateWarehouse,
} = require('../controllers/warehouseControllers/updateWarehouse');

const {
  deleteWarehouse,
} = require('../controllers/warehouseControllers/deleteWarehouse');

// CREATE WAREHOUSE
router.post(
  '/create',
  auth,
  adminAuth,
  createWarehouseController
);

// GET ALL WAREHOUSES
router.get(
  '/list',
  auth,
  getWarehousesController
);

// UPDATE WAREHOUSE
router.put(
  '/update/:id',
  auth,
  adminAuth,
  updateWarehouse
);

// DELETE WAREHOUSE
router.delete(
  '/delete/:id',
  auth,
  adminAuth,
  deleteWarehouse
);

module.exports = router;