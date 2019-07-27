const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('password', salt);

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    userName: 'JohnDoe',
    email: 'john.doe@andela.com',
    bio: 'local man is stuck in traffic',
    isVerified: true,
    role: 'superAdmin',
    password: hash,
    verificationToken: '',
    imageUrl: 'image.png'
  }, {
    firstName: 'Cavdy',
    lastName: 'Ghost',
    userName: 'Cavdy',
    email: 'cavdyofficials@gmail.com',
    bio: '#ghost',
    isVerified: true,
    role: 'admin',
    password: hash,
    verificationToken: '',
    imageUrl: 'image.png'
  }, {
    firstName: 'John2',
    lastName: 'Doe2',
    userName: 'JohnDoe2',
    email: 'john.doe2@andela.com',
    bio: 'local man is stuck in traffic',
    isVerified: true,
    role: 'user',
    password: 'password',
    verificationToken: '',
    imageUrl: 'image.png'
  },

  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
