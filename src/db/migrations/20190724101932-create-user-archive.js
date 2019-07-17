module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserArchives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      oldId: {
        type: Sequelize.INTEGER,
        required: true,
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
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        required: false,
        defaultValue: false,
      },
      role: {
        type: Sequelize.ENUM(['superAdmin', 'admin', 'user']),
        required: true,
        allowNull: false,
        defaultValue: 'user',
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserArchives');
  }
};