'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  UserProfile.init(
    {
      profileId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserProfile',
      tableName: 'UserProfiles',
      timestamps: true, 
      underscored: false,
    }
  );

  return UserProfile;
};
