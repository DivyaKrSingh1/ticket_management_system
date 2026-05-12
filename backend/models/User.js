const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   role: { type: String, enum: ['employee', 'admin'], default: 'employee' }
}, { timestamps: true });


const UserModel = mongoose.model('User', userSchema);

// Function to get user by email
const getUserByEmail = async (email) => {
    const user = await UserModel.findOne({ email });
    if (user) {
        return user;
    }
    return null;
};

// Function to create new user
const createUser = async (name, email, password ) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(UserModel);
    console.log(typeof UserModel);
    const user = new UserModel({ name, email, password:hashedPassword });
    await user.save();
    return user;
};

const getAllUsers = async () => {
    const users = await UserModel.find();
    return users;
};

const getAllUsersForAdmin = async () => {
    return await UserModel.find().select('-password');
};

const updateUserRoleById = async (userId, role) => {
    return await UserModel.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
};

const editUserById = async (userId, name, email) => {
    return await UserModel.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
};

const deleteUserById = async (userId) => {
    return await UserModel.findByIdAndDelete(userId);
};

const getUserStats = async () => {
    const totalUsers = await UserModel.countDocuments();
    const totalAdmins = await UserModel.countDocuments({ role: 'admin' });
    const totalEmployees = await UserModel.countDocuments({ role: 'employee' });
    return { totalUsers, totalAdmins, totalEmployees };
};

const getEmployees = async () => {
    return await UserModel.find({ role: 'employee' }).select('name email');
};

// Function to compare password
const comparePassword = async (enteredPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
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
    getEmployees,
    UserModel,
    User: UserModel
};