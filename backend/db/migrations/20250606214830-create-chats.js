'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure UUID extension exists for UUID generation
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('Chats', {
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
      isGroup: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // ✅ Indexes for performance
    await queryInterface.addIndex('Chats', ['userId']);
    await queryInterface.addIndex('Chats', ['name']);
    await queryInterface.addIndex('Chats', ['userId', 'name']); 
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Chats');
  },
};
