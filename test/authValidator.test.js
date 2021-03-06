import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/server';


chai.use(chaiHttp);
chai.should();

const testUser = {
  userName: 'test-user',
  email: 'testuser@gmail.com',
  password: 'testpassword12',
};

describe('Auth', () => {
  describe('POST /users', () => {
    it('should return 400 error if userName is empty', (done) => {
      const { userName, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.userName.should.be.an('string');
          res.body.message.userName.should.eql('Username is required.');
          done();
        });
    });

    it('should return 400 error if userName is invalid', (done) => {
      const invalidUsername = {
        userName: '$hdh.',
        email: 'test@gmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(invalidUsername)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.userName.should.be.an('string');
          res.body.message.userName.should.eql('Invalid username.');
          done();
        });
    });

    it('should return 400 error if userName character length is invalid', (done) => {
      const invalidUsername = {
        userName: 'verylongusernamethatishardtospellreadandwrite',
        email: 'test@gmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(invalidUsername)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.userName.should.be.an('string');
          res.body.message.userName.should.eql('Username must be between 3 and 20 characters.');
          done();
        });
    });

    it('should return 409 error if userName already exists', (done) => {
      const invalidUsername = {
        userName: 'JohnDoe',
        email: 'test@gmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(invalidUsername)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.userName.should.be.an('string');
          res.body.message.userName.should.eql('Username already exists.');
          done();
        });
    });

    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.email.should.be.an('string');
          res.body.message.email.should.eql('Email is required.');
          done();
        });
    });

    it('should return 400 error if email is invalid', (done) => {
      const invalidEmail = {
        userName: 'user-one',
        email: 'testgmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.email.should.be.an('string');
          res.body.message.email.should.eql('Invalid email address.');
          done();
        });
    });

    it('should return 409 error if email already exists', (done) => {
      const existingEmail = {
        userName: 'johnDoe',
        email: 'john.doe@andela.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(existingEmail)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.email.should.be.an('string');
          res.body.message.email.should.eql('Email already exists.');
          done();
        });
    });

    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.password.should.be.an('string');
          res.body.message.password.should.eql('Password is required.');
          done();
        });
    });

    it('should return 400 error if password is invalid', (done) => {
      const invalidPassword = {
        userName: 'user-one',
        email: 'test@gmail.com',
        password: '%#^^#**HHFBSNMR'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.password.should.be.an('string');
          res.body.message.password.should.eql('Password must be alphanumeric.');
          done();
        });
    });

    it('should return 400 error if password character length is invalid', (done) => {
      const invalidPassword = {
        userName: 'user-one',
        email: 'test@gmail.com',
        password: 'hdh3fht'
      };

      chai.request(app).post('/api/v1/auth/signup')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.password.should.be.an('string');
          res.body.message.password.should.eql('Password must be between 8 to 15 characters long.');
          done();
        });
    });
  });

  describe('POST /users/login', () => {
    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/login')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.email.should.be.an('string');
          res.body.message.email.should.eql('Email is required.');
          done();
        });
    });

    it('should return 400 error if email is invalid', (done) => {
      const invalidEmail = {
        userName: 'user-one',
        email: 'testgmail.com',
        password: 'haggsff354'
      };

      chai.request(app).post('/api/v1/auth/login')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.email.should.be.an('string');
          res.body.message.email.should.eql('Invalid email address.');
          done();
        });
    });

    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/login')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.password.should.be.an('string');
          res.body.message.password.should.eql('Password is required.');
          done();
        });
    });

    it('should return 400 error if password is invalid', (done) => {
      const invalidPassword = {
        userName: 'user-one',
        email: 'test@gmail.com',
        password: 'hett464...%#&&#'
      };

      chai.request(app).post('/api/v1/auth/login')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.password.should.be.an('string');
          res.body.message.password.should.eql('Password must be alphanumeric.');
          done();
        });
    });

    it('should return 400 error if password character length is invalid', (done) => {
      const invalidPassword = {
        userName: 'user-one',
        email: 'test@gmail.com',
        password: 'hdh3fht'
      };

      chai.request(app).post('/api/v1/auth/login')
        .send(invalidPassword)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.password.should.be.an('string');
          res.body.message.password.should.eql('Password must be between 8 to 15 characters long.');
          done();
        });
    });
  });
});
