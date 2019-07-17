module.exports = (sequelize, DataTypes) => {
    const highlightComment = sequelize.define('highlightComment', {
      highlightedWord: {
        type: DataTypes.STRING,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false
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
    }, {});
    highlightComment.associate = function(models) {
      // associations can be defined here
      highlightComment.belongsTo(models.User, {
        as: 'highlightComment',
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      highlightComment.belongsTo(models.Article, {
        foreignKey: 'articleId',
        as: 'article',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    };
    return highlightComment;
  };
