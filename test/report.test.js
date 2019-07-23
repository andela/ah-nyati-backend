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
const testReport = {
  body: 'This report contains propaganda',
  reportType: 'article',
  typeId: 1
};

describe('Reports', () => {
  before('Get request tokens', async () => {
    try {
      const url = '/api/v1/auth/login';
      const response = await chai.request(app).post(url).send(user);
      testToken = response.body.token;
    } catch (error) {
      return error;
    }
  });

  describe('POST /reports', () => {
    it('should create a new report', (done) => {
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(testReport)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message').eql(`${testReport.reportType} successfully reported`);
          done();
        });
    });

    it('should return 400 error if body is empty', (done) => {
      const { body, ...partialReport } = testReport;
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(partialReport)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.body.should.be.an('string');
          res.body.message.body.should.eql('Article body is required.');
          done();
        });
    });

    it('should return 400 error if reportType is empty', (done) => {
      const { reportType, ...partialReport } = testReport;
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(partialReport)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.reportType.should.be.an('string');
          res.body.message.reportType.should.eql('reportType is required.');
          done();
        });
    });

    it('should return 400 error if reportType is invalid', (done) => {
      const invalidReport = { ...testReport, reportType: 'commen' };
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(invalidReport)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.reportType.should.be.an('string');
          res.body.message.reportType.should.eql('Invalid reportType.');
          done();
        });
    });

    it('should return 400 error if typeId is empty', (done) => {
      const { typeId, ...partialReport } = testReport;
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(partialReport)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.typeId.should.be.an('string');
          res.body.message.typeId.should.eql('typeId is required.');
          done();
        });
    });

    it('should return 400 error if typeId is invalid', (done) => {
      const invalidReport = { ...testReport, typeId: 'rhfj' };
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(invalidReport)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.be.an('object');
          res.body.message.typeId.should.be.an('string');
          res.body.message.typeId.should.eql('typeId must be an integer.');
          done();
        });
    });
  
    it('should return 404 error if comment does not exist', (done) => {
      const invalidReport = { ...testReport, reportType: 'comment', typeId: 40 };
      chai.request(app).post('/api/v1/reports')
        .set('token', testToken)
        .send(invalidReport)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.message.should.be.an('string');
          res.body.message.should.equal('comment not found');
          done();
        });
    });
  });
});
