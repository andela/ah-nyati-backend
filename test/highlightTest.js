import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import app from '../src/server';

chai.use(chaiHttp);

let userToken;
describe('Testing Higlight and comment Controller', () => {
  describe('Testing Higlight and comment controller', () => {
    const highlight = '/api/v1/articles/highlight/';

    // SIGN IN USER TO GET TOKEN
    it('should login user successfully', (done) => {
      const user = {
        email: 'john.doe@andela.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          userToken = res.body.token;
          done();
        });
    });

    const higlighted = {
      highlightedWord: 'survived not only',
      comment: 'very good'
    }
    it(
      'should highlight and comment if valid',
      async () => {
        const response = await chai.request(app)
          .post(`${highlight}article`)
          .set('token', userToken)
          .send(higlighted);
        expect(response).to.be.an('object');
        expect(response).to.have.status(201);
        expect(response.body.message).to.equal(`${higlighted.highlightedWord} has been highlighted`);
      },
    );

    it(
      'should not highlight and comment if invalid',
      async () => {
        const response = await chai.request(app)
          .post(`${highlight}article`)
          .set('token', userToken)
          .send({
            highlightedWord: 'survived not onlysssss',
            comment: 'very good'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body.message).to.equal('invalid highlighted word');
      },
    );

    it(
      'should not highlight and comment if no highlighted word',
      async () => {
        const response = await chai.request(app)
          .post(`${highlight}article`)
          .set('token', userToken)
          .send({
            comment: 'very good'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'should not highlight and comment if no comment',
      async () => {
        const response = await chai.request(app)
          .post(`${highlight}article`)
          .set('token', userToken)
          .send({
            highlightedWord: 'survived not onlysssss',
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
      },
    );
  });
});
