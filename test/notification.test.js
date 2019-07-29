import chaiHttp from 'chai-http';
import chai, {
  expect
} from 'chai';

import app from '../src/server';

chai.use(chaiHttp);

let testToken;

describe('Testing Notification Controller', () => {
  describe('Testing notification route controller', () => {
    const notificationRoute = '/api/v1/user/notification';

    // SIGN IN USER TO GET TOKEN
    it('should login user successfully', (done) => {
      const user = {
        email: 'john.doe@andela.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          testToken = res.body.token;
          done();
        });
    });

    // TEST NOTIFICATION
    it(
      'user should get notification',
      async () => {
        const response = await chai.request(app)
          .get(`${notificationRoute}`)
          .set('token', testToken)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'should make read true if user read notification',
      async () => {
        const response = await chai.request(app)
          .post(`${notificationRoute}/1`)
          .set('token', testToken)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Notification successfully read');
      },
    );

    it(
      'should disable notification for a user',
      async () => {
        const response = await chai.request(app)
          .post(`${notificationRoute}/disable/1`)
          .set('token', testToken)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('You have successfully opt out from receiving notifications');
      },
    );
  });
});
