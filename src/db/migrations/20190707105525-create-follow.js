module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Follows', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
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
    followId: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Follows')
};
