module.exports = (sequelize, DataTypes) => {
    const Bookmark = sequelize.define('Bookmark', {
      userId: {
        type: DataTypes.INTEGER,
        required: true,
      },
      articleId: {
        type: DataTypes.INTEGER,
        required: true,
      }
    }, {});
    Bookmark.associate = (models) => {
      Bookmark.belongsTo(models.Article, {
        foreignKey: 'articleId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookmark.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    };
    return Bookmark;
  };
  