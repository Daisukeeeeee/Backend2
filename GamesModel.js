const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Game = sequelize.define('games', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'genres',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    information: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    operatingSystem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    processor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    memory: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    graphicCard: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    storage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    screenshotUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true, 
    },
    filePath: {
      type: DataTypes.STRING(255), 
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
  });

  return Game;
};
