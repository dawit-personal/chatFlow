'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure UUID extension exists for UUID generation
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    await queryInterface.createTable('ChatMembers', {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chats',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      joinedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // 🔍 Indexes
    await queryInterface.addIndex('ChatMembers', ['chatId']);
    await queryInterface.addIndex('ChatMembers', ['userId']);
    await queryInterface.addIndex('ChatMembers', ['joinedAt']);
    await queryInterface.addIndex('ChatMembers', ['chatId', 'userId'], {
      name: 'chat_user_composite_idx',
      unique: true, // Optional: makes sure a user cannot join the same chat twice
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ChatMembers');
  },
};
