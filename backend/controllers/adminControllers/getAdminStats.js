const {
  getTicketStats,
  getEmployeeTicketStats,
} = require('../../models/Ticket');

const {
  getUserStats,
  UserModel,
} = require('../../models/User');

const getAdminStats = async (
  req,
  res
) => {
  try {

    // USER STATS
    const {
      totalUsers,
      totalAdmins,
      totalEmployees,
      totalWarehouseEmployees,
    } = await getUserStats();

    // TICKET STATS
    const {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
    } = await getTicketStats();

    // EMPLOYEES
    const employees =
      await UserModel.find({
        role: {
          $in: [
            'employee',
            'warehouse_employee',
          ],
        },
      }).select('name email');

    // PERFORMANCE
    const employeeStats =
      await getEmployeeTicketStats(
        employees
      );

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalEmployees,
      totalWarehouseEmployees,
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      employeeStats,
    });

  } catch (error) {

    console.log(
      'ADMIN STATS ERROR:',
      error
    );

    res.status(500).json({
      message:
        'Error fetching admin stats',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};