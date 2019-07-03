'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define('Blacklist', {
    token: {
      type: DataTypes.TEXT,
    },
  }, {});
  Blacklist.associate = function(models) {
    // associations can be defined here
  };
  return Blacklist;
};
