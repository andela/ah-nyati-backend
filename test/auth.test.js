import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller', () => {
  const defaultUser = {
    userName: 'MaryJane',
    email: 'mary.jane@andela.com',
    password: 'userpassword'
  };
  it(('should signup a user'), (done) => {
    chai.request(app).post('/api/v1/auth/signup')
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.message.should.be.a('string').eql('User signup successful');
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

  it('should logout user successfully', (done) => {
    chai.request(app).post('/api/v1/auth/logout')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('User successfully Logged Out');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('should login user successfully', (done) => {
    const user = {
      email: 'john.doe@andela.com',
      password: 'password',
    };
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('User successfully Logged In');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('status');
        done();
      });
  });
});
