'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants', [
      { name: 'Demo Diner', address: '100 Sample Rd', lat: 37.7749, lng: -122.4194, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};
