const { editUserById } =
require('../../models/User');

const editUser = async (
  req,
  res
) => {

  try {

    const { userId } =
      req.params;

    const {
      name,
      email,
      warehouse,
      phone,
      address,
    } = req.body;

    const user =
      await editUserById(
        userId,
        name,
        email,
        warehouse,
        phone,
        address
      );

    if (!user) {

      return res.status(404).json({
        message: 'User not found',
      });

    }

    res.status(200).json({
      message:
        'User updated successfully',
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Error updating user',
      error: error.message,
    });

  }
};

module.exports = {
  editUser,
};