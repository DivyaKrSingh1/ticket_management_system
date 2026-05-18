const {
  saveAttendance,
} = require('../../models/Attendance');

const markAttendance = async (req, res) => {
  try {
    const { warehouseId, date, attendance } =
      req.body;

    for (const item of attendance) {
      await saveAttendance(
        item.userId,
        warehouseId,
        date,
        item.status,
        req.user.id
      );
    }

    res.status(200).json({
      message: 'Attendance saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving attendance',
      error: error.message,
    });
  }
};

module.exports = { markAttendance };