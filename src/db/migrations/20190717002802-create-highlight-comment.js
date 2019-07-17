module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('highlightComments', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        highlightedWord: {
          type: Sequelize.STRING
        },
        comment: {
          type: Sequelize.STRING
        },
        userId: {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Users',
            key: 'id',
            as: 'userId'
          }
        },
        articleId: {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Articles',
            key: 'id',
            as: 'articleId'
          }
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
      return queryInterface.dropTable('highlightComments');
    }
  };