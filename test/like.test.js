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

describe('LikeController', () => {
  it('should enable a user to like an article', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/article/like')
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(201);
            expect(res.body.data[0]).to.have.property('id');
            expect(res.body.data[0]).to.have.property('slug');
            expect(res.body.data[0]).to.have.property('body');
            expect(res.body.message).to.equal('You just liked this article');
            done();
          });
      });
  });

  it('should enable a user to unlike an article', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/article/like')
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.data[0]).to.have.property('id');
            expect(res.body.data[0]).to.have.property('slug');
            expect(res.body.data[0]).to.have.property('body');
            expect(res.body.message).to.equal('You just unliked this article');
            done();
          });
      });
  });

  it('should indicate that an article does not exist', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/articles/like')
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(404);
            expect(res.body.message).equal('Article not found');
            done();
          });
      });
  });
});
