module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    userId: {
      type: DataTypes.INTEGER,
      required: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      required: true,
    }
  }, {});
  CommentLike.associate = (models) => {
      CommentLike.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    CommentLike.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return CommentLike;
};


