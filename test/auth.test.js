import chai from 'chai';
import chaiHttp from 'chai-http';


import app from '../src/server';
import { User } from '../src/db/models';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let token;

describe('Auth', () => {
  before(() => {
    const email = ['main.jane@gmail.com', 'main.jane3@gmail.com'];
    email.map((i) => {
      const user = User.findOne({
        where: {
          email: i
        }
      });
      if (user) {
        User.destroy({
          where: {
            email: i
          }
        });
      }
    });
  });
  describe('User Controller', () => {
    const defaultUser = {
      userName: 'jamie',
      email: 'main.jane@gmail.com',
      password: 'password'
    };
    it(('should signup a user'), (done) => {
      chai.request(app).post('/api/v1/auth/signup')
        .send(defaultUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.message.should.be.a('string').eql('A link has been sent to your mailbox for verification');
          done();
        });
    });
    it(('should throw a server error'), (done) => {
      chai.request(app).post('/api/v1/auth/signup')
        .send(app)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.be.a('string').eql('Internal server error');
          done();
        });
    });
    it(('should verify a new user account'), (done) => {
      const defaultUser2 = {
        userName: 'jamie3',
        email: 'main.jane3@gmail.com',
        password: 'password'
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(defaultUser2)
        .end((err, res) => {
          const decode = res.body.token;
          chai.request(app).get(`/api/v1/auth/verify/${decode}`)
            .send()
            .end((err, res) => {
              res.should.have.status(200);
              res.body.message.should.be.a('string').eql('Your account has been verified');
            });
          done();
        });
    });
    it(('should not verify an invalid user account'), (done) => {
      chai.request(app).get('/api/v1/auth/verify/ihihih79797968gjgjg')
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message.should.be.a('string').eql('Invalid user credential');
          done();
        });
    });
    const existingUser = {
      email: 'main.jane@gmail.com',
      password: 'password'
    };
    it(('should login a user'), (done) => {
      chai.request(app).post('/api/v1/auth/login')
        .send(existingUser)
        .end((err, res) => {
          token = res.body.token;
          res.body.data.should.be.an('object');
          res.should.have.status(200);
          res.body.message.should.be.a('string').eql('User Login successful');
          done();
        });
    });
    it(('It should return invalid email or password'), (done) => {
      const newUser = { ...existingUser, email: 'pass..' };
      chai.request(app).post('/api/v1/auth/login')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.be.a('boolean').eql(true);
          res.body.message.should.be.a('string').eql('Invalid email or password');
          done();
        });
    });
    it(('It should return invalid email or password'), (done) => {
      const newUser = { ...existingUser, password: 'fakeuser@gmail.com' };
      chai.request(app).post('/api/v1/auth/login')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.be.a('boolean').eql(true);
          res.body.message.should.be.a('string').eql('Invalid email or password');
          done();
        });
    });

    it('should logout user successfully', (done) => {
      chai.request(app).post('/api/v1/auth/logout')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.message).equal('User successfully Logged Out');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('status');
          done();
        });
    });
    it('should fail to logout user successfully', (done) => {
      chai.request(app).post('/api/v1/auth/logout')
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(409);
          expect(res.body.message).equal('User already Logged Out');
          done();
        });
    });
    it('user should provide a token', (done) => {
      chai.request(app).post('/api/v1/auth/logout')
        .set('token', '')
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.error).equal('Token is required');
          done();
        });
    });
  });
});
