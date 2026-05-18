const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['employee', 'admin', 'warehouse_employee'],
      default: 'employee',
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      default: null,
    },

    phone: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

// Get user by email
const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });

  if (user) {
    return user;
  }

  return null;
};

// Create new user
const createUser = async (
  name,
  email,
  password,
  role = 'employee',
  warehouse = null
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
    role,
    warehouse,
  });

  await user.save();

  return user;
};

// Get all users
const getAllUsers = async () => {
  return await UserModel.find().populate('warehouse');
};

// Get users for admin
const getAllUsersForAdmin = async () => {
  return await UserModel.find()
    .populate('warehouse')
    .select('-password');
};

// Update role
const updateUserRoleById = async (userId, role) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select('-password');
};

// Edit user
const editUserById = async (
  userId,
  name,
  email,
  warehouse,
  phone,
  address
) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      warehouse,
      phone,
      address,
    },
    { new: true }
  ).select('-password');
};

// Delete user
const deleteUserById = async (userId) => {
  return await UserModel.findByIdAndDelete(userId);
};

// Dashboard stats
const getUserStats = async () => {
  const totalUsers = await UserModel.countDocuments();

  const totalAdmins = await UserModel.countDocuments({
    role: 'admin',
  });

  const totalEmployees = await UserModel.countDocuments({
    role: 'employee',
  });

  const totalWarehouseEmployees =
    await UserModel.countDocuments({
      role: 'warehouse_employee',
    });

  return {
    totalUsers,
    totalAdmins,
    totalEmployees,
    totalWarehouseEmployees,
  };
};

// Get warehouse employees
const getWarehouseEmployees = async (
  warehouseId = null
) => {

  let filter = {
    role: { $in: ['employee', 'warehouse_employee'] }
  };

  if (warehouseId) {
    filter.warehouse = warehouseId;
  }

  return await UserModel.find(filter)
    .populate('warehouse')
    .select('-password');
};

// Compare password
const comparePassword = async (
  enteredPassword,
  hashedPassword
) => {
  return await bcrypt.compare(
    enteredPassword,
    hashedPassword
  );
};

const getEmployees = async () => {
  return await UserModel.find({
    role: 'employee',
  }).select('name email');
};

module.exports = {
  getUserByEmail,
  createUser,
  comparePassword,
  getAllUsers,
  getAllUsersForAdmin,
  updateUserRoleById,
  editUserById,
  deleteUserById,
  getUserStats,
  getWarehouseEmployees,
  getEmployees,
  UserModel,
  User: UserModel,
};