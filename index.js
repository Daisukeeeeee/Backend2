const { DataTypes } = require('sequelize');
const sequelize = require('../data/db.js');

sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};

db.sequelize = sequelize;

db.Category = require('./CategoriesModel.js')(sequelize, DataTypes);
db.Genre = require('./GenreModels.js')(sequelize, DataTypes);
db.Game = require('./GamesModel.js')(sequelize, DataTypes);
db.User = require('./UserModel.js')
db.Admin = require('./adminModel.js')(sequelize, DataTypes);
db.Analytics = require('./AnalyticsModel.js');
db.StripeTransaction = new require('./StripeModel.js');


db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized successfully.');
}).catch((error) => {
  console.error('Error synchronizing database:', error);
});

db.Category.hasMany(db.Genre, {
  foreignKey: 'categoryId',
  as: 'genres',
});

db.Genre.belongsTo(db.Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

db.Genre.hasMany(db.Game, {
  foreignKey: 'genreId',
  as: 'games', 
});

db.Game.belongsTo(db.Genre, {
  foreignKey: 'genreId',
  as: 'genres',
});

db.Analytics.belongsTo(db.Game, {
  foreignKey: 'gameId',
  as: 'games',
});

db.Analytics.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = db;
