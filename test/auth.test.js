import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let token;

describe('User Controller', () => {
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
