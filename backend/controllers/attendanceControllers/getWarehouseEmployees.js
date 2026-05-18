const { UserModel } =
  require('../../models/User');

const getWarehouseEmployees =
  async (req, res) => {

    try {

      const { warehouseId } =
        req.query;

      console.log(
        'warehouseId:',
        warehouseId
      );

      const employees =
        await UserModel.find({

          warehouse: warehouseId,

          role: {
            $in: [
              'employee',
              'warehouse_employee',
            ],
          },

        })
          .select('-password')
          .populate('warehouse');

      console.log(
        'employees:',
        employees
      );

      res.status(200).json({
        employees,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error fetching warehouse employees',
        error: error.message,
      });

    }
  };

module.exports = {
  getWarehouseEmployees,
};