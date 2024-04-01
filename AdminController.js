const User = require('../model/UserModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByPk(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deletedUser.destroy();

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const promoteToAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.is_admin = true;
    await user.save();

    // if (!req.user || req.user.role !== 'admin') {
    //   console.error('Unauthorized: Admin privileges required');
    //   return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
    // }

    console.log('User promoted to admin successfully:', user);
    res.status(200).json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ message: 'Error promoting user to admin', error: error.message });
  }
};

const demoteFromAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.is_admin = false;
    await user.save();

    // if (!req.user || req.user.role !== 'admin') {
    //   console.error('Unauthorized: Admin privileges required');
    //   return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
    // }

    console.log('User demoted from admin successfully:', user);
    res.status(200).json({ message: 'User demoted from admin successfully', user });
  } catch (error) {
    console.error('Error demoting user from admin:', error);
    res.status(500).json({ message: 'Error demoting user from admin', error: error.message });
  }
};


// const checkAdminAuthentication = (req, res) => {
//   try {
//     if (req.admin) {
//       res.status(200).json({ isAdmin: true });
//     } else {
//       res.status(403).json({ isAdmin: false });
//     }
//   } catch (error) {
//     console.error('Error checking admin authentication:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

module.exports = {
  getAllUsers,
  deleteUser,
  promoteToAdmin,
  demoteFromAdmin,
  // checkAdminAuthentication,
};
