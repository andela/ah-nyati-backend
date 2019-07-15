module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
    catId: {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Categories',
        key: 'id',
        as: 'catId'
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Articles')
};
