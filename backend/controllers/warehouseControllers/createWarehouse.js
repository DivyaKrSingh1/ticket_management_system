const {
  createWarehouse,
  getWarehouseByName,
} = require('../../models/Warehouse');

const createWarehouseController = async (
  req,
  res
) => {
  try {
    const { name, location, description } =
      req.body;

    const existingWarehouse =
      await getWarehouseByName(name);

    if (existingWarehouse) {
      return res.status(400).json({
        message: 'Warehouse already exists',
      });
    }

    const warehouse = await createWarehouse(
      name,
      location,
      description
    );

    res.status(201).json({
      message:
        'Warehouse created successfully',
      warehouse,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Error creating warehouse',
      error: error.message,
    });
  }
};

module.exports = {
  createWarehouseController,
};  