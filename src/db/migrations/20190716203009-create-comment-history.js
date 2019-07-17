module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CommentHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
          model: 'CommentHistories',
          key: 'id',
          as: 'commentHistory'
        },
      },
      commentId: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
          model: 'CommentHistories',
          key: 'id',
          as: 'commentHistory'
        },
      },
      commentBody: {
        type: Sequelize.STRING,
        required: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CommentHistories');
  }
};
