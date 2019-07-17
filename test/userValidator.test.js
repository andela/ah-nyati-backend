import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/server';


chai.use(chaiHttp);
chai.should();

let testToken;
const user = {
  email: 'john.doe@andela.com',
  password: 'password',
};

describe('User Access', () => {
  before('Get request tokens', async () => {
    try {
      const url = '/api/v1/auth/login';
      const response = await chai.request(app).post(url).send(user);
      testToken = response.body.token;
    } catch (error) {
      return error;
    }
  });

  describe('PUT /user/access/:userId', () => {
    it('should pass if userRole is in mixed casing', (done) => {
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

    it('should return 400 error if userId is invalid', (done) => {
      chai.request(app).put('/api/v1/user/access/t')
        .set('token', testToken)
        .send({ userRole: 'admin'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.userId.should.be.an('string');
          res.body.message.userId.should.eql('Invalid userId param.');
          done();
        });
    });

    it('should return 400 error if userRole is invalid', (done) => {
      chai.request(app).put('/api/v1/user/access/4')
        .set('token', testToken)
        .send({ userRole: 'normalUser'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.userRole.should.be.an('string');
          res.body.message.userRole.should.eql('Invalid userRole.');
          done();
        });
    });
  });
});
