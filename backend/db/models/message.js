'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // A message belongs to a Chat
      Message.belongsTo(models.Chat, {
        foreignKey: 'chatId',
        as: 'chat',
      });

      // A message is sent by a User
      Message.belongsTo(models.User, {
        foreignKey: 'senderUserId',
        as: 'sender',
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      messageType: {
        type: DataTypes.ENUM('text', 'image', 'video', 'file'),
        allowNull: false,
        defaultValue: 'text',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages',
      timestamps: false,
      underscored: false,
    }
  );

  return Message;
};
