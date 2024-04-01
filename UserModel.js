const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'user',
});

User.sync({ alter: true });

User.beforeCreate(async (user) => {
  if (user.password) {
    user.passwordHash = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.passwordHash = await bcrypt.hash(user.password, 10);
  }
});
module.exports = User;