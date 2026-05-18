const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    location: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const WarehouseModel = mongoose.model(
  'Warehouse',
  warehouseSchema
);

// CREATE WAREHOUSE
const createWarehouse = async (
  name,
  location,
  description
) => {
  const warehouse = new WarehouseModel({
    name,
    location,
    description,
  });

  await warehouse.save();

  return warehouse;
};

// GET ALL WAREHOUSES
const getAllWarehouses = async () => {
  return await WarehouseModel.find().sort({
    createdAt: -1,
  });
};

// GET WAREHOUSE BY NAME
const getWarehouseByName = async (name) => {
  return await WarehouseModel.findOne({ name });
};

// UPDATE WAREHOUSE
const updateWarehouseById = async (
  id,
  data
) => {
  return await WarehouseModel.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

// DELETE WAREHOUSE
const deleteWarehouseById = async (id) => {
  return await WarehouseModel.findByIdAndDelete(
    id
  );
};

module.exports = {
  WarehouseModel,
  Warehouse: WarehouseModel,
  createWarehouse,
  getAllWarehouses,
  getWarehouseByName,
  updateWarehouseById,
  deleteWarehouseById,
};