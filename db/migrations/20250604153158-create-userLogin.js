'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserLogins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',   
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('active', 'revoked', 'expired', 'logged_out'),
        defaultValue: 'active',
        allowNull: false,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      ipAddress: {
        type: Sequelize.STRING(45), // IPv6 max length
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      expiresAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      revoked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('UserLogins', ['userId']);
    await queryInterface.addIndex('UserLogins', ['token']);
    await queryInterface.addIndex('UserLogins', ['revoked']);
    await queryInterface.addIndex('UserLogins', ['expiresAt']);
    await queryInterface.addIndex('UserLogins', ['userId', 'revoked']);
    await queryInterface.addIndex('UserLogins', ['userId', 'expiresAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserLogins');
  },
};
