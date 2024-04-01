const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/UserModel');
const { generateToken } = require('../middlewares/authMiddleware');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('is_admin during login:', user.is_admin);

      const token = generateToken(user);

      console.log('Token generated:', token);

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_admin: user.is_admin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, is_admin } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      is_admin: is_admin || false,
    });
 
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        is_admin: newUser.is_admin,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.error('Error creating user:', error); 
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const [updatedRowsCount] = await User.update(req.body, { where: { id: id } });

    if (updatedRowsCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const deletedRowsCount = await User.destroy({ where: { id: userId } });

    if (deletedRowsCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
