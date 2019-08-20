import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import dotenv from 'dotenv';


import app from '../src/server';

dotenv.config();

chai.use(chaiHttp);
chai.should();
let articleSlug;
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
          articleSlug  = res.body.data[0].slug;
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


    it('should update an article', (done) => {
      chai.request(app).patch(`/api/v1/articles/${articleSlug}`)
        .set('token', testToken)
        .field(testArticle)
        .attach('images', path.join(__dirname, 'img/test.jpg'), 'test.png')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('object');
          res.body.data.should.have.property('imageUrl');
          res.body.data.imageUrl.should.be.an('string');
          res.body.data.should.have.property('slug');
          res.body.data.slug.should.be.an('string');
          res.body.data.should.have.property('isDraft');
          res.body.data.isDraft.should.be.an('boolean');
          res.body.data.slug.slice(0, 29).should.be.eql('the-rise-of-the-shadow-knight');
          res.body.data.title.should.be.an('string').eql('The Rise of The Shadow Knight');
          res.body.data.body.should.be.an('string').eql('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
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

    it('should create article if isDraft is empty', (done) => {
      const { isDraft, ...partialArticleDetails } = testArticle;
      chai.request(app).post('/api/v1/articles')
        .set('token', testToken)
        .send(partialArticleDetails)
        .end((err, res) => {
          res.should.have.status(201);
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

describe('Article Controller', () => {
  describe('Testing article controller', () => {
    const article = '/api/v1/articles/';
    it(
      'should get article',
      async () => {
        const response = await chai.request(app)
          .get(`${article}article`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('message');
        expect(response.body.data[0]).to.have.property('article');
      },
    );

    it(
      'should not get article when nothing found',
      async () => {
        const response = await chai.request(app)
          .get(`${article}artic`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
        expect(response.body.status).to.equal(404);
      },
    );

    it(
      'should return 404 when an incorrect route is tested',
      async () => {
        const response = await chai.request(app)
          .get('/api/v1/article/artic')
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
      },
    );
  });
});