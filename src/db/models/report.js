module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    body: DataTypes.TEXT,
    reportType: DataTypes.ENUM(['article', 'comment']),
    reportTypeId: DataTypes.INTEGER
  }, {});
  Report.associate = function(models) {
  };
  return Report;
};
