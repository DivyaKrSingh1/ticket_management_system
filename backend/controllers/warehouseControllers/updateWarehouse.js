const Warehouse = require('../../models/Warehouse');

const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        message: 'Warehouse not found',
      });
    }

    res.status(200).json({
      message: 'Warehouse updated successfully',
      warehouse,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating warehouse',
      error: error.message,
    });
  }
};

module.exports = { updateWarehouse };