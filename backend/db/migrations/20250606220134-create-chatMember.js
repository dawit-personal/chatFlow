'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure the uuid-ossp extension is enabled
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('ChatMembers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
        type: Sequelize.UUID,
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
