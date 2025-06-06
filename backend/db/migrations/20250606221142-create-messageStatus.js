'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure UUID extension exists
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('MessageStatuses', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      messageId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Messages',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('sent', 'delivered', 'read'),
        allowNull: false,
        defaultValue: 'sent',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Indexes
    await queryInterface.addIndex('MessageStatuses', ['messageId']);
    await queryInterface.addIndex('MessageStatuses', ['userId']);
    await queryInterface.addIndex('MessageStatuses', ['status']);
    await queryInterface.addIndex('MessageStatuses', ['messageId', 'userId'], {
      unique: true, // Enforce one status per user per message
      name: 'message_user_unique_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MessageStatuses');
  }
};
