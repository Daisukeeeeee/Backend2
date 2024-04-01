const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  // quantity: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   defaultValue: 1, 
  //   validate: {
  //     min: 1,
  //   },
  // },
});
 
module.exports = Cart;
