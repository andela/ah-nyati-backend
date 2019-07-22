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

describe('TagController', () => {
  it('should enable a user to update an article tag', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/tag/article')
          .send({ tagName: 'amity' })
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(201);
            expect(res.body.message).equal('Article has been tagged as amity');
            done();
          });
      });
  });

  it('should indicate that an article does not exist', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/tag/articled')
        .send({ tagName: 'amity' })
        .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(404);
            expect(res.body.message).equal('Article not found');
            done();
          });
      });
  });
    it('should throw an error if article tag is empty', (done) => {
      chai.request(app).post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          testToken = res.body.token;
          chai.request(app).post('/api/v1/articles/tag/article')
            .send({ tagName: '' })
            .set('token', testToken)
            .end((err, res) => {
              res.should.have.status(400);
              expect(res.body.message.tagName).equal('Value cannot be empty');
              done();
            });
          });
      });
});
