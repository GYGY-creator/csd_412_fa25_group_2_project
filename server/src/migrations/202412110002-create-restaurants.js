'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurants', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      lat: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      lng: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      google_place_id: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurants');
  }
};
