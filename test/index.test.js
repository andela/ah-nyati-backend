import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.should();
chai.use(chaiHttp);

describe('server', () => {
  it('should start the server successfully', (done) => {
    chai.request(app).get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
