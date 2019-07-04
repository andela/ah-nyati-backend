module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstname: 'John',
    lastname: 'Doe',
    username: 'JohnDoe',
    email: 'john.doe@andela.com',
    bio: 'local man is stuck in traffic',
    isVerified: true,
    password: 'password',
    verificationToken: '',
    imageUrl: 'image.png'
  },
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
