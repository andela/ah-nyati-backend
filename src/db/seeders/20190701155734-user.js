module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
<<<<<<< HEAD
    firstName: 'John',
    lastName: 'Doe',
    userName: 'JohnDoe',
=======
    firstname: 'John',
    lastname: 'Doe',
    username: 'JohnDoe',
>>>>>>> feature(signout backend): User signout backend-create user controller-add a signout function-create a blacklist model-create logout route[Delivers #166841010]
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
