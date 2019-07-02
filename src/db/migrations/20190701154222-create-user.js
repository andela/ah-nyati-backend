module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      required: true,
      allowNull: false
    },
    image_url: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    bio: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
