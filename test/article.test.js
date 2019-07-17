import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';

import app from '../src/server';

chai.use(chaiHttp);
chai.should();

let testToken;
const user = {
  email: 'john.doe@andela.com',
  password: 'password',
};
const testArticle = {
  title: 'The Rise of The Shadow Knight',
  body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  tagList: 'traffic,lagos,local,amity',
  catId: 1,
  userId: 1,
  isDraft: 'false'
};

const invalidArticle = {
  title: 'The Rise of The Shadow Knight',
  body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  tagList: 'traffic,lagos,local,amity',
  catId: 1,
  userId: 1,
  isDraft: 'fals'
};

describe('Articles', () => {
  before('Get request tokens', async () => {
    try {
      const url = '/api/v1/auth/login';
      const response = await chai.request(app).post(url).send(user);
      testToken = response.body.token;
    } catch (error) {
      return error;
    }
  });

  describe('POST /articles', () => {
    it('should create a new article', (done) => {
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .field(testArticle)
        .attach('images', path.join(__dirname, 'img/test.jpg'), 'test.png')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('imageUrl');
          res.body.data[0].imageUrl.should.be.an('string');
          res.body.data[0].should.have.property('slug');
          res.body.data[0].slug.should.be.an('string');
          res.body.data[0].should.have.property('isDraft');
          res.body.data[0].isDraft.should.be.an('boolean');
          res.body.data[0].slug.slice(0, 29).should.be.eql('the-rise-of-the-shadow-knight');
          res.body.data[0].title.should.be.an('string').eql('The Rise of The Shadow Knight');
          res.body.data[0].body.should.be.an('string').eql('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
          res.body.data[0].userId.should.be.an('number').eql(1);
          res.body.data[0].catId.should.be.an('number').eql(1);
          done();
        });
    });

    it('should return 400 error if title is empty', (done) => {
      const { title, ...partialArticleDetails } = testArticle;
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .send(partialArticleDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.title.should.be.an('string');
          res.body.message.title.should.eql('Title is required.');
          done();
        });
    });

    it('should return 400 error if isDraft is invalid', (done) => {
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .send(invalidArticle)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.isDraft.should.be.an('string');
          res.body.message.isDraft.should.eql('isDraft must be true or false');
          done();
        });
    });

    it('should return 400 error if article body is empty', (done) => {
      const { body, ...partialArticleDetails } = testArticle;
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .send(partialArticleDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.body.should.be.an('string');
          res.body.message.body.should.eql('Article body is required.');
          done();
        });
    });

    it('should return 400 error if catId is empty', (done) => {
      const { catId, ...partialArticleDetails } = testArticle;
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .send(partialArticleDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.catId.should.be.an('string');
          res.body.message.catId.should.eql('Category id is required.');
          done();
        });
    });

    it('should return 404 error if catId does not exist', (done) => {
      const partialArticleDetails = { ...testArticle, catId: 90 };
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .send(partialArticleDetails)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('message').equal('The category does not exist');
          done();
        });
    });
  });
});
