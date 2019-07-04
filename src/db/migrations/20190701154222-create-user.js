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
      allowNull: true
    },
    lastname: {
      type: Sequelize.STRING,
      required: true,
      allowNull: true
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
    isVerified: {
      type: Sequelize.BOOLEAN,
      required: false,
      allowNull: true
    },
    imageUrl: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    verificationToken: {
      type: Sequelize.STRING,
      unique: true
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
