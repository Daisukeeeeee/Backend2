const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Analytics = sequelize.define('analytics', {
  totalGames: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
  },
  activeUsers: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
  },
  revenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
  // gameId: {
  //   type: DataTypes.INTEGER, // Define the 'gameId' column
  //   allowNull: true,
  // },
  // userId: {
  //   type: DataTypes.INTEGER, // Define the 'userId' column
  //   allowNull: true,
  // },
});

module.exports = Analytics;
