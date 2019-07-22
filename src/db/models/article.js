module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
      body: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      isDraft: DataTypes.BOOLEAN,
      views: DataTypes.INTEGER,
      read: DataTypes.INTEGER,
      readRatio: DataTypes.INTEGER
    },
    {}
  );
  Article.associate = models => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'catId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Tag, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Like, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Tag, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.Rating, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Article.hasMany(models.highlightComment, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Article.hasMany(models.Bookmark, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Article;
};
