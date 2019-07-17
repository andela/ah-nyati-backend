module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Reports', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        body: {
          type: Sequelize.TEXT,
          required: true,
          allowNull: false
        },
        reportType: {
          type: Sequelize.ENUM(['article', 'comment']),
          required: true,
          allowNull: false
        },
        reportTypeId: {
          type: Sequelize.INTEGER,
          required: true,
          allowNull: false
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
      return queryInterface.dropTable('Reports');
    }
  };