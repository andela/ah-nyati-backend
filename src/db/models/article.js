module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    body: DataTypes.TEXT,
    tag_list: DataTypes.STRING
  }, {});
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'cat_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Article;
};
