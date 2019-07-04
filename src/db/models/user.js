module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type: DataTypes.STRING,
      required: true
    },
    lastname: {
      type: DataTypes.STRING,
      required: true
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
    is_verified: {
      type: DataTypes.BOOLEAN,
    },
    bio: {
      type: DataTypes.STRING
    },
    social: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
      required: true
    },
    token: {
      type: DataTypes.STRING
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
