module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
      imageUrl: {
        type: DataTypes.STRING,
        required: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        required: false,
      },
    },
    {},
  );
  User.associate = models => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'userArticles',
    });
    User.hasMany(models.Like, {
      foreignKey: 'userId',
      as: 'userLikes'
    });
    User.hasMany(models.Follow, {
      foreignKey: 'followee',
      as: 'followee'
    });
    User.hasMany(models.Follow, {
      foreignKey: 'follower',
      as: 'follower'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'userComments'
    });
    User.hasMany(models.UserReport, {
      foreignKey: 'reporterId',
      as: 'userReports',
    });
    User.hasMany(models.highlightComment, {
      foreignKey: 'userId',
      as: 'highlightComment'
    });
    User.hasMany(models.CommentLike, {
      foreignKey: 'userId',
      as: 'userCommentsLike'
    });
    User.hasMany(models.CommentHistory, {
      foreignKey: 'userId',
      as: 'CommentsHistory'
    });
    User.hasMany(models.Bookmark, {
      foreignKey: 'userId',
      as: 'userBookmarks'
    });
  };
  return User;
};
