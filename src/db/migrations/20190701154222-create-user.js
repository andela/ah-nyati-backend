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
      required: true,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
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
      required: true,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    bio: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    verificationToken: {
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
