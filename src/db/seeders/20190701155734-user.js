module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@andela.com',
    bio: 'local man is stuck in traffic',
    is_verified: true,
    password: 'password',
    token: '',
    image_url: 'image.png'
  },
  {
    firstname: 'Ikenna',
    lastname: 'Isaiah',
    email: 'cavdyofficials@gmail.com',
    bio: 'testing',
    is_verified: true,
    password: 'password',
    token: '',
    image_url: 'image.png'
  },
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
