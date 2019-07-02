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
    userName: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
<<<<<<< HEAD
    userName: {
=======
    username: {
>>>>>>> feature(signout backend): User signout backend-create user controller-add a signout function-create a blacklist model-create logout route[Delivers #166841010]
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
      required: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    bio: {
      type: DataTypes.STRING
    },
    imageUrl: {
      type: DataTypes.STRING,
      required: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      required: false,
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
