/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/server';

chai.use(chaiHttp);
chai.should();

const testUser = {
  username: 'test-user',
  email: 'testuser@gmail.com',
  password: 'testpassword12',
};

describe('Auth', () => {
  describe('POST /users', () => {
    it('should return 400 error if username is empty', (done) => {
      const { username, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/users')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.username.should.be.an('array');
          res.body.errors.username[0].should.eql('Username is required.');
          done();
        });
    });

    it('should return 400 error if username is invalid', (done) => {
      const invalidUsername = {
        username: '$hdh.',
        email: 'test@gmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/users')
        .send(invalidUsername)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.username.should.be.an('array');
          res.body.errors.username[0].should.eql('Invalid username.');
          done();
        });
    });

    it('should return 400 error if username character length is invalid', (done) => {
      const invalidUsername = {
        username: 'verylongusernamethatishardtospellreadandwrite',
        email: 'test@gmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/users')
        .send(invalidUsername)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.username.should.be.an('array');
          res.body.errors.username[0].should.eql('Username must be between 3 and 20 characters.');
          done();
        });
    });

    it('should return 401 error if username already exists', (done) => {
      const invalidUsername = {
        username: 'JohnDoe',
        email: 'test@gmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/users')
        .send(invalidUsername)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.username.should.be.an('array');
          res.body.errors.username[0].should.eql('Username already exists.');
          done();
        });
    });

    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/users')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.email.should.be.an('array');
          res.body.errors.email[0].should.eql('Email is required.');
          done();
        });
    });

    it('should return 400 error if email is invalid', (done) => {
      const invalidEmail = {
        username: 'user-one',
        email: 'testgmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/users')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.email.should.be.an('array');
          res.body.errors.email[0].should.eql('Invalid email address.');
          done();
        });
    });

    it('should return 401 error if email already exists', (done) => {
      const existingEmail = {
        username: 'johnDoe',
        email: 'john.doe@andela.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/users')
        .send(existingEmail)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.email.should.be.an('array');
          res.body.errors.email[0].should.eql('Email already exists.');
          done();
        });
    });

    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/users')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.password.should.be.an('array');
          res.body.errors.password[0].should.eql('Password is required.');
          done();
        });
    });

    it('should return 400 error if password is invalid', (done) => {
      const invalidPassword = {
        username: 'user-one',
        email: 'test@gmail.com',
        password: 'hdhhfhh.%fjkkd'
      };

      chai.request(app).post('/api/users')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.password.should.be.an('array');
          res.body.errors.password[0].should.eql('Password must contain a letter and a number.');
          done();
        });
    });

    it('should return 400 error if password character length is invalid', (done) => {
      const invalidPassword = {
        username: 'user-one',
        email: 'test@gmail.com',
        password: 'hdh3fht'
      };

      chai.request(app).post('/api/users')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.password.should.be.an('array');
          res.body.errors.password[0].should.eql('Password must be between 8 to 15 characters long.');
          done();
        });
    });
  });

  describe('POST /users/login', () => {
    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/users/login')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.email.should.be.an('array');
          res.body.errors.email[0].should.eql('Email is required.');
          done();
        });
    });

    it('should return 400 error if email is invalid', (done) => {
      const invalidEmail = {
        username: 'user-one',
        email: 'testgmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/users/login')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.email.should.be.an('array');
          res.body.errors.email[0].should.eql('Invalid email address.');
          done();
        });
    });

    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/users/login')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.password.should.be.an('array');
          res.body.errors.password[0].should.eql('Password is required.');
          done();
        });
    });

    it('should return 400 error if password is invalid', (done) => {
      const invalidPassword = {
        username: 'user-one',
        email: 'test@gmail.com',
        password: 'hdhhfhh.%fjkkd'
      };

      chai.request(app).post('/api/users/login')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.password.should.be.an('array');
          res.body.errors.password[0].should.eql('Password must contain a letter and a number.');
          done();
        });
    });

    it('should return 400 error if password character length is invalid', (done) => {
      const invalidPassword = {
        username: 'user-one',
        email: 'test@gmail.com',
        password: 'hdh3fht'
      };

      chai.request(app).post('/api/users/login')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
          res.body.should.be.an('object');
          res.body.errors.password.should.be.an('array');
          res.body.errors.password[0].should.eql('Password must be between 8 to 15 characters long.');
          done();
        });
    });
  });
});
