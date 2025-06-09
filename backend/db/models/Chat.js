'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Chat was created by a User
      Chat.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'creator',
      });

      Chat.hasMany(models.ChatMember, {
        foreignKey: 'chatId',
        as: 'members', // This must match the alias used in the `include`!
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Chat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      tableName: 'Chats',
      timestamps: true, 
      underscored: false,
    }
  );

  return Chat;
};
