import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let testToken;

describe('UserController', () => {
  const existingUser = {
    email: 'john.doe@andela.com',
    password: 'password'
  };
  it(('should login a user'), (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send(existingUser)
      .end((err, res) => {
        testToken  = res.body.token;
        res.body.data.should.be.an('array');
        res.should.have.status(200);
        res.body.message.should.be.a('string').eql('User Login successful');
        done();
      });
  });

  it('should request for token', (done) => {
    chai.request(app).put('/api/v1/user/profiles/1')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).equal('Token is not provided!');
        done();
      });
  });

  it('should not accept invalid token', (done) => {
    chai.request(app).put('/api/v1/user/profiles/1')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .set('token', 'hello')
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).equal('Invalid token provided');
        done();
      });
  });

  it('should enable user create and update profile', (done) => {
    chai.request(app).put('/api/v1/user/profiles/1')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.data[0].firstName).equal('John');
        expect(res.body.data[0].lastName).equal('Doe');
        expect(res.body.data[0].bio).equal('This is a test bio');
        expect(res.body.data[0].userName).equal('JohnDoe');
        done();
      });
  });

  it('should not perform operation for unauthorized user', (done) => {
    chai.request(app).put('/api/v1/user/profiles/2')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'This is a test bio',
        userName: 'JohnDoe',
      })
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).equal('You do not have permission to perform that operation');
        done();
      });
  });

  it('should enable user create and update profile image', (done) => {
    chai.request(app).put('/api/v1/user/profiles/1')
      .attach('avatar', path.join(__dirname, 'img/test.png'), 'test.png')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should request for a valid image', (done) => {
    chai.request(app).put('/api/v1/user/profiles/1')
      .attach('avatar', path.join(__dirname, 'img/test.srt'), 'test.png')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should return the right error messages', (done) => {
    chai.request(app).put('/api/v1/user/profiles/1')
      .send({
        firstName: 'John1',
        lastName: 'Doe2',
        email: 'john.doeandela.com',
        bio: 'This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio This is a test bio',
      })
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message.firstName).equal('First name can only contain letters');
        expect(res.body.message.lastName).equal('Last name can only contain letters');
        expect(res.body.message.bio).equal('Bio cannot exceed 150 characters');
        done();
      });
  });

  it('should enable user view another user\'s profile', (done) => {
    chai.request(app).get('/api/v1/user/profiles/JohnDoe')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.data[0].firstName).equal('John');
        expect(res.body.data[0].lastName).equal('Doe');
        expect(res.body.data[0].bio).equal('This is a test bio');
        expect(res.body.data[0].userName).equal('JohnDoe');
        done();
      });
  });

  it('should enable user view another user\'s profile', (done) => {
    chai.request(app).get('/api/v1/user/profiles/JohnDoes')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).equal('User not found');
        done();
      });
  });

  it('should enable user view all authors profile', (done) => {
    chai.request(app).get('/api/v1/user/profiles')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(200);
        done();
      });
  });

  it('should not get all authors profile when token is not present', (done) => {
    chai.request(app).get('/api/v1/user/profiles')
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.status).to.equal(401);
        done();
      });
    })

  describe('PUT /user/access/:userId', () => {
    it('should change the user access level', (done) => {
      chai.request(app).put('/api/v1/user/access/4')
        .set('token', testToken)
        .send({ userRole: 'superADmin'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.should.be.an('string').eql('User access level successfully changed');
          done();
        });
    });
  });

  describe('DELETE /user/:userId', () => {
    it('should delete a user', (done) => {
      chai.request(app).delete('/api/v1/user/3')
        .set('token', testToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.should.be.an('string').eql('User successfully deleted');
          done();
        });
    });
  });

});
