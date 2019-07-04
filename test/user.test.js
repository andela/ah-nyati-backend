import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let token;

describe('UserController', () => {
  it('should login user successfully', (done) => {
    const user = {
      email: 'john.doe@andela.com',
      password: 'password',
    };
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        token = res.body.data;
        res.should.have.status(200);
        expect(res.body.message).equal('User successfully Logged In');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('status');
        done();
      });
  });

  it('should request for token', (done) => {
    chai.request(app).put('/api/v1/profiles/1')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.error).equal('token is not provided!');
        done();
      });
  });

  it('should not accept invalid token', (done) => {
    chai.request(app).put('/api/v1/profiles/1')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .set('token', 'hello')
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.error).equal('Invalid token provided');
        done();
      });
  });

  it('should enable user create and update profile', (done) => {
    chai.request(app).put('/api/v1/profiles/1')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.user.firstName).equal('John');
        expect(res.body.user.lastName).equal('Doe');
        expect(res.body.user.bio).equal('This is a test bio');
        expect(res.body.user.userName).equal('JohnDoe');
        done();
      });
  });

  it('should not perform operation for unauthorized user', (done) => {
    chai.request(app).put('/api/v1/profiles/2')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.error).equal('You do not have permission to perform that operation');
        done();
      });
  });

  it('should enable user create and update profile image', (done) => {
    chai.request(app).put('/api/v1/profiles/1')
      .attach('avatar', path.join(__dirname, 'img/test.png'), 'test.png')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should request for a valid image', (done) => {
    chai.request(app).put('/api/v1/profiles/1')
      .attach('avatar', path.join(__dirname, 'img/test.srt'), 'test.png')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should return the right error messages', (done) => {
    chai.request(app).put('/api/v1/profiles/1')
      .send({
        firstName: 'John1',
        lastName: 'Doe2',
        email: 'john.doeandela.com',
        bio: 'This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio',
      })
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.errors[0]).equal('First name can only contain letters');
        expect(res.body.errors[1]).equal('Last name can only contain letters');
        expect(res.body.errors[2]).equal('Input a valid email address');
        expect(res.body.errors[3]).equal('Bio cannot exceed 150 characters');
        done();
      });
  });

  it('should enable user view another user\'s profile', (done) => {
    chai.request(app).get('/api/v1/profiles/JohnDoe')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.users.firstName).equal('John');
        expect(res.body.users.lastName).equal('Doe');
        expect(res.body.users.bio).equal('This is a test bio');
        expect(res.body.users.userName).equal('JohnDoe');
        done();
      });
  });

  it('should enable user view another user\'s profile', (done) => {
    chai.request(app).get('/api/v1/profiles/JohnDoes')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.error).equal('User not found');
        done();
      });
  });
});
