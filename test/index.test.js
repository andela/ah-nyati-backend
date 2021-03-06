import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('server', () => {
  it('should start the server successfully', done => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Route not found', done => {
    chai
      .request(app)
      .get('/error')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
describe('Swagger', () => {
  it('should return an object', (done) => {
    chai.request(app).get('/api-docs')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });
});
