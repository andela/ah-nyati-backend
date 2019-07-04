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
<<<<<<< HEAD
      required: false,
    },
    lastName: {
      type: Sequelize.STRING,
      required: false,
=======
      required: true,
      allowNull: true
>>>>>>> feat(signup):user signup route
    },
    userName: {
      type: Sequelize.STRING,
      required: true,
<<<<<<< HEAD
      unique: true
=======
      allowNull: true
>>>>>>> feat(signup):user signup route
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
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      required: false,
<<<<<<< HEAD
      defaultValue: false

=======
      allowNull: true
>>>>>>> feat(signup):user signup route
    },
    imageUrl: {
      type: Sequelize.STRING,
      required: false,
<<<<<<< HEAD
=======
      allowNull: true
>>>>>>> feat(signup):user signup route
    },
    bio: {
      type: Sequelize.STRING,
      required: false,
<<<<<<< HEAD
    },
    verificationToken: {
      type: Sequelize.STRING,
      required: false,
=======
      allowNull: true
    },
    encripted: {
      type: Sequelize.STRING,
      unique: true
>>>>>>> feat(signup):user signup route
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
