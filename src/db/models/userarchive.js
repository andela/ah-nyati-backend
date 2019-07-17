
module.exports = (sequelize, DataTypes) => {
  const UserArchive = sequelize.define('UserArchive', {
    oldId: {
      type: DataTypes.INTEGER,
      required: true,
    },
    firstName: {
      type: DataTypes.STRING,
      required: false,
    },
    lastName: {
      type: DataTypes.STRING,
      required: false,
    },
    userName: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    bio: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM(['superAdmin', 'admin', 'user']),
    },
    imageUrl: {
      type: DataTypes.STRING,
      required: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      required: false,
    },
    oldCreatedAt: {
      type: DataTypes.DATE,
      required: true,
    },
    oldUpdatedAt: {
      type: DataTypes.DATE,
      required: true,
    }
  }, {});
  UserArchive.associate = function(models) {
    // associations can be defined here
  };
  return UserArchive;
};