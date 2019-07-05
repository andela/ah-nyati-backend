module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      required: false
    },
    lastName: {
      type: DataTypes.STRING,
      required: false
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      required: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    bio: {
      type: DataTypes.STRING
    },
    social: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
      required: true
    },
    verificationToken: {
      type: DataTypes.STRING
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
