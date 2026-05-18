const {
  getAttendanceByUserId,
} = require('../../models/Attendance');

const getEmployeeAttendance = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const attendance =
      await getAttendanceByUserId(id);

    let fullDay = 0;
    let halfDay = 0;
    let absent = 0;

    attendance.forEach((item) => {
      if (item.status === 'full_day') {
        fullDay++;
      } else if (item.status === 'half_day') {
        halfDay++;
      } else {
        absent++;
      }
    });

    const totalDays = attendance.length;

    const attendancePercentage =
      totalDays === 0
        ? 0
        : (
            ((fullDay + halfDay * 0.5) /
              totalDays) *
            100
          ).toFixed(2);

    res.status(200).json({
      totalDays,
      fullDay,
      halfDay,
      absent,
      attendancePercentage,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'Error fetching employee attendance',
      error: error.message,
    });
  }
};

module.exports = {
  getEmployeeAttendance,
};