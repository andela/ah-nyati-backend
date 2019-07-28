module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    follower: {
      type: DataTypes.STRING,
      required: true
    },
  }, {});
  Follow.associate = (models) => {
    // associations can be defined here
    Follow.belongsTo(models.User, {
      foreignKey: 'followee',
      as: 'following',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Follow.belongsTo(models.User, {
      foreignKey: 'follower',
      as: 'followers',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Follow;
};
