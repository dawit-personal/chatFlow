'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MessageStatus extends Model {
    static associate(models) {
      // Each status is for one message
      MessageStatus.belongsTo(models.Message, {
        foreignKey: 'messageId',
        onDelete: 'CASCADE',
      });

      // Each status is tied to one user
      MessageStatus.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }

  MessageStatus.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('sent', 'delivered', 'read'),
        allowNull: false,
        defaultValue: 'sent',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'MessageStatus',
      tableName: 'MessageStatuses',
      timestamps: true,
      underscored: false,
    }
  );

  return MessageStatus;
};
