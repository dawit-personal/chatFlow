'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove old `token` column if you're no longer using it
    await queryInterface.removeColumn('UserLogins', 'token');

    // Add `accessToken`
    await queryInterface.addColumn('UserLogins', 'accessToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add `refreshToken`
    await queryInterface.addColumn('UserLogins', 'refreshToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Optional: Add index on refreshToken for lookup/revocation
    await queryInterface.addIndex('UserLogins', ['refreshToken']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserLogins', 'accessToken');
    await queryInterface.removeColumn('UserLogins', 'refreshToken');
    await queryInterface.addColumn('UserLogins', 'token', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  }
};
