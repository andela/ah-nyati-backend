'use strict';
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    userId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
  }, {});
  notification.associate = (models) => {
    // associations can be defined here
    notification.belongsTo(models.User, {
      as: 'userNotification',
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return notification;
};
