module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Categories', [{
    name: 'Education',
    slug: 'education'
  },
  {
    name: 'Technology',
    slug: 'technology'
  },
  {
    name: 'Sports',
    slug: 'sports'
  }
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
