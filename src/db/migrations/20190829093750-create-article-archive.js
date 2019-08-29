module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArticleArchives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      oldId: {
        type: Sequelize.INTEGER,
        required: true,
      },
      title: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      body: {
        type: Sequelize.TEXT,
        required: true,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      isDraft: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      views: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      read: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      readRatio: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      oldCreatedAt: {
        type: Sequelize.DATE,
        required: true,
      },
      oldUpdatedAt: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('ArticleArchives');
  }
};