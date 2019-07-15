module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Tags', [{
    tagName: 'lagos',
    articleId: 1
  }
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
