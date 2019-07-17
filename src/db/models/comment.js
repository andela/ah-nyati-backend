const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentBody: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'id',
        as: 'articleId'
      }
    },
  });

  Comment.associate = (models) => {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      as: 'userComments',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Comment.hasMany(models.CommentHistory, {
      foreignKey: 'commentId',
      as: 'CommentsHistory'
    });
  };
  return Comment;
};
export default comment;
