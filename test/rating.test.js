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

describe('RatingController', () => {
  it('should enable a user to rate an article', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/rate/article')
          .send({ value: 5 })
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.rating).equal(5);
            expect(res.body).to.have.property('article');
            expect(res.body.message).equal('Article has been rated as 5 star');
            done();
          });
      });
  });

  it('should enable a user to update a rating', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/rate/article')
          .send({ value: 4 })
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.rating).equal(4);
            expect(res.body).to.have.property('article');
            expect(res.body.message).equal('Article rating has been updated as 4 star');
            done();
          });
      });
  });
  it('should indicate that an article does not exist', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/rate/articledd')
          .send({ value: 4 })
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(404);
            expect(res.body.error).equal('Article not found');
            done();
          });
      });
  });
  it('should only allow integers from 0 to 5', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/rate/article')
          .send({ value: 9 })
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.errors[0]).equal('Value can only be between 0 and 5');
            done();
          });
      });
  });
  it('should only allow integers from 0 to 5', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        chai.request(app).post('/api/v1/articles/rate/article')
          .send({ value: 'gfg' })
          .set('token', testToken)
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.errors[0]).equal('Value can only be numeric');
            expect(res.body.errors[1]).equal('Value can only be between 0 and 5');
            done();
          });
      });
  });
});
