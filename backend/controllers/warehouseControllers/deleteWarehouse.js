const warehouseModel =
  require('../../models/Warehouse');

const userModel =
  require('../../models/User');

console.log(
  'warehouseModel',
  warehouseModel
);

console.log(
  'userModel',
  userModel
);

const Warehouse =
  warehouseModel.Warehouse;

const UserModel =
  userModel.UserModel;

const deleteWarehouse = async (
  req,
  res
) => {

  try {

    console.log(
      'DELETE API HIT'
    );

    const { id } = req.params;

    console.log('ID', id);

    console.log(
      'Warehouse',
      Warehouse
    );

    console.log(
      'UserModel',
      UserModel
    );

    await UserModel.updateMany(
      { warehouse: id },
      {
        $set: {
          warehouse: null,
        },
      }
    );

    const warehouse =
      await Warehouse.findByIdAndDelete(
        id
      );

    console.log(
      'warehouse deleted',
      warehouse
    );

    if (!warehouse) {

      return res.status(404).json({
        message:
          'Warehouse not found',
      });

    }

    res.status(200).json({
      message:
        'Warehouse deleted successfully',
    });

  } catch (error) {

    console.log(
      'DELETE ERROR'
    );

    console.log(error);

    res.status(500).json({
      message:
        'Error deleting warehouse',
      error: error.message,
    });

  }
};

module.exports = {
  deleteWarehouse,
};