const {
  getAllWarehouses,
} = require('../../models/Warehouse');

const getWarehousesController = async (
  req,
  res
) => {
  try {
    const warehouses =
      await getAllWarehouses();

    res.status(200).json({
      warehouses,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Error fetching warehouses',
      error: error.message,
    });
  }
};

module.exports = {
  getWarehousesController,
};