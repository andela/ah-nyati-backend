module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      required: false,
    },
    lastName: {
      type: DataTypes.STRING,
      required: true,
    },
    userName: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    bio: {
      type: DataTypes.STRING
    },
    imageUrl: {
      type: DataTypes.STRING,
      required: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'userArticles'
    });
  };
  return User;
};
