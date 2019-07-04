module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define('Blacklist', {
    token: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {});
  Blacklist.associate = (models) => {
    // associations can be defined here
  };
  return Blacklist;
};
