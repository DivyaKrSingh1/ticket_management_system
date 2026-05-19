const {
  saveAttendance,
  getAttendanceByWarehouseAndDate,
} = require('../../models/Attendance');


// MARK ATTENDANCE
const markAttendance = async (req, res) => {

  try {

    const {
      userId,
      warehouseId,
      date,
      status,
    } = req.body;

    // CHECK REQUIRED FIELDS
    if (
      !userId ||
      !warehouseId ||
      !date ||
      !status
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // SAVE / UPDATE ATTENDANCE
    const attendance =
      await saveAttendance(
        userId,
        warehouseId,
        date,
        status,
        req.user?._id || null
      );

    res.status(200).json({
      success: true,
      message: 'Attendance saved successfully',
      attendance,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ATTENDANCE BY DATE
const getAttendanceByDate = async (
  req,
  res
) => {

  try {

    const {
      warehouseId,
      date,
    } = req.query;

    const attendance =
      await getAttendanceByWarehouseAndDate(
        warehouseId,
        date
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
  markAttendance,
  getAttendanceByDate,
};