const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   role: { type: String, enum: ['employee', 'admin'], default: 'employee' }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

// Function to get user by email
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return user;
    }
    return null;
};

// Function to create new user
const createUser = async (name, email, password ) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashedPassword });
    await user.save();
    return user;
};

const getAllUsers = async () => {
     const users = await User.find();
     return users;
    };
   

// Function to compare password
const comparePassword = async (enteredPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
};

module.exports = { getUserByEmail, createUser, comparePassword, getAllUsers, User };
