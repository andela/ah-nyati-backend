import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let testToken;

const user = {
  email: 'john.doe@andela.com',
  password: 'password',
};

describe('BookmarkController', () => {
  it('should enable a user to bookmark an article', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/bookmark/article')
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.message).to.equal('You just bookmarked this article');
            done();
          });
      });
  });

  it('should enable a user to unbookmark an article', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/bookmark/article')
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.message).to.equal('You just unbookmarked this article');
            done();
          });
      });
  });

  it('should indicate that an article does not exist', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/bookmark/art')
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(404);
            expect(res.body.message).equal('Article not found');
            done();
          });
      });
  });
});
