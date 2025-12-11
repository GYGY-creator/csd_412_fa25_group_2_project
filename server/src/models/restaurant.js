const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Restaurant = sequelize.define('Restaurant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    lat: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    lng: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    googlePlaceId: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'restaurants'
  });

  Restaurant.associate = (models) => {
    Restaurant.hasMany(models.Review, { foreignKey: 'restaurantId' });
  };

  return Restaurant;
};
