const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'full_day',
        'half_day',
        'absent',
      ],
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

attendanceSchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

const AttendanceModel = mongoose.model(
  'Attendance',
  attendanceSchema
);

// SAVE ATTENDANCE
const saveAttendance = async (
  userId,
  warehouseId,
  date,
  status,
  markedBy
) => {
  return await AttendanceModel.findOneAndUpdate(
    {
      user: userId,
      date,
    },
    {
      user: userId,
      warehouse: warehouseId,
      date,
      status,
      markedBy,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

// GET ATTENDANCE BY DATE
const getAttendanceByWarehouseAndDate =
  async (warehouseId, date) => {
    return await AttendanceModel.find({
      warehouse: warehouseId,
      date,
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  };

// GET EMPLOYEE ATTENDANCE
const getAttendanceByUserId = async (
  userId
) => {
  return await AttendanceModel.find({
    user: userId,
  })
    .populate('user', 'name email')
    .sort({ date: -1 });
};

module.exports = {
  AttendanceModel,
  Attendance: AttendanceModel,
  saveAttendance,
  getAttendanceByWarehouseAndDate,
  getAttendanceByUserId,
};