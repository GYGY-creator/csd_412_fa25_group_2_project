const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    restaurantId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'reviews'
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'userId' });
    Review.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
  };

  return Review;
};
