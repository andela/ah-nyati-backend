module.exports = (sequelize, DataTypes) => {
    const CommentHistory = sequelize.define('CommentHistory', {
      userId: {
        type: DataTypes.INTEGER,
        required: true,
      },
      commentId: {
        type: DataTypes.INTEGER,
        required: true,
      },
      commentBody: {
        type: DataTypes.TEXT,
        required: true,
      },
    }, {});
    CommentHistory.associate = (models) => {
      // associations can be defined here
      CommentHistory.belongsTo(models.User, {
        as: 'user',
        foriegnKey: 'userId',
        onDelete: 'CASCADE'
      });
      CommentHistory.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        as: 'comment',
        onDelete: 'CASCADE'
      });
    };
    return CommentHistory;
  };
