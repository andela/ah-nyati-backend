module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    tagName: {
      type: DataTypes.STRING,
      required: true
    },
  }, {});
  return Tag;
};
