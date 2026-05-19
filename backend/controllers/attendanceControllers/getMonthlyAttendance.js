const {
  Attendance,
} = require('../../models/Attendance');

const getMonthlyAttendance =
  async (req, res) => {

    try {

      const {
        warehouseId,
        month,
        year,
      } = req.query;

      const startDate =
        `${year}-${String(month).padStart(2, '0')}-01`;

      const endDate =
        `${year}-${String(month).padStart(2, '0')}-31`;

      const attendance =
        await Attendance.find({

          warehouse: warehouseId,

          date: {
            $gte: startDate,
            $lte: endDate,
          },

        }).populate(
          'user',
          'name email'
        );

      res.status(200).json({
        success: true,
        attendance,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  getMonthlyAttendance,
};