module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
      required: false,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      required: false,
      allowNull: false
    },
    userName: {
      type: Sequelize.STRING,
      required: true,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      required: false,
      defaultValue: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      required: false,
    },
    bio: {
      type: Sequelize.STRING,
      required: false,
    },
    social: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    verificationToken: {
      type: Sequelize.STRING,
      required: false,
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
