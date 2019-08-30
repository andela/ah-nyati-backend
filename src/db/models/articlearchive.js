module.exports = (sequelize, DataTypes) => {
  const ArticleArchive = sequelize.define('ArticleArchive', {
    oldId: {
      type: DataTypes.INTEGER,
      required: true,
    },
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    isDraft: DataTypes.BOOLEAN,
    views: DataTypes.INTEGER,
    read: DataTypes.INTEGER,
    readRatio: DataTypes.INTEGER,
    oldCreatedAt: {
      type: DataTypes.DATE,
      required: true,
    },
    oldUpdatedAt: {
      type: DataTypes.DATE,
      required: true,
    }
  }, {});
  ArticleArchive.associate = function(models) {
    // associations can be defined here
  };
  return ArticleArchive;
};