module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    value: {
      type: DataTypes.INTEGER,
      required: true,
    }
  }, {});
  Rating.associate = (models) => {
    Rating.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Rating;
};
