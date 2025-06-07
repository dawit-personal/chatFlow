'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatMember extends Model {
    static associate(models) {
      ChatMember.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      ChatMember.belongsTo(models.Chat, {
        foreignKey: 'chatId',
        as: 'chat',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  ChatMember.init(
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
        references: {
          model: 'Chats',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChatMember',
      tableName: 'ChatMembers',
      timestamps: true,
      underscored: false,
    }
  );

  return ChatMember;
};
