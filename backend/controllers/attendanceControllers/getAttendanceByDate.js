const {
  getAttendanceByWarehouseAndDate,
} = require('../../models/Attendance');

const getAttendanceByDate = async (
  req,
  res
) => {
  try {
    const { warehouseId, date } = req.query;

    const attendance =
      await getAttendanceByWarehouseAndDate(
        warehouseId,
        date
      );

    res.status(200).json({
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Error fetching attendance',
      error: error.message,
    });
  }
};

module.exports = { getAttendanceByDate };