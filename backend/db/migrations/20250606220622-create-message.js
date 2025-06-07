'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Ensure UUID extension exists for UUID generation
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chats',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      senderUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      messageType: {
        type: Sequelize.ENUM('text', 'image', 'video', 'file'),
        allowNull: false,
        defaultValue: 'text',
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });

    // Indexes for performance
    await queryInterface.addIndex('Messages', ['chatId']);
    await queryInterface.addIndex('Messages', ['senderUserId']);
    await queryInterface.addIndex('Messages', ['timestamp']);
    await queryInterface.addIndex('Messages', ['chatId', 'timestamp']); // Composite for chat history
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Messages');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Messages_messageType";');
  },
};
