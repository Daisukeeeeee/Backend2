module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("categories", {          
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        published: {
            type: DataTypes.BOOLEAN
        }
    });
  
    return Categories;
  };
  