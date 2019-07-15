module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Follows', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    followee: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
      references: {
        model: 'Users',
        key: 'id',
        as: 'user'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    follower: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true,
      references: {
        model: 'Users',
        key: 'id',
        as: 'user'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Follows');
  }
};
