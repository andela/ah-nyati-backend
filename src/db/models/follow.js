module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define('Follow', {
      followId: {
        type: DataTypes.STRING,
        required: true
      },
    }, {});
    Follow.associate = (models) => {
      // associations can be defined here
      Follow.belongsTo(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    };
    return Follow;
  };