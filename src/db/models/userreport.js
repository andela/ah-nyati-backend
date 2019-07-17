module.exports = (sequelize, DataTypes) => {
  const UserReport = sequelize.define('UserReport', {
  }, {});
  UserReport.associate = function(models) {
    UserReport.belongsTo(models.User, {
      foreignKey: 'reporterId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    UserReport.belongsTo(models.Report, {
      foreignKey: 'reportId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return UserReport;
};
