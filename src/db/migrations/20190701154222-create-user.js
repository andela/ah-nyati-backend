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
    },
    lastName: {
      type: Sequelize.STRING,
      required: false,
    },
    userName: {
      type: Sequelize.STRING,
      required: true,
      unique: true
    },
<<<<<<< HEAD
    userName: {
=======
    username: {
>>>>>>> feature(signout backend): User signout backend-create user controller-add a signout function-create a blacklist model-create logout route[Delivers #166841010]
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
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
