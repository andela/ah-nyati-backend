module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type: DataTypes.STRING,
      required: true,
    },
    lastname: {
      type: DataTypes.STRING,
      required: true,
    },
    username: {
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
      type: DataTypes.STRING
    },
    encripted: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'user_id',
      as: 'user_articles'
    });
  };
  return User;
};
