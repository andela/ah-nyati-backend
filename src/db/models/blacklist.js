<<<<<<< HEAD
=======
'use strict';
>>>>>>> feature(signout backend): User signout backend-create user controller-add a signout function-create a blacklist model-create logout route[Delivers #166841010]
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
<<<<<<< HEAD
};
=======
};
>>>>>>> feature(signout backend): User signout backend-create user controller-add a signout function-create a blacklist model-create logout route[Delivers #166841010]
