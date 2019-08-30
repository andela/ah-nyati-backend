import '@babel/polyfill';
import chaiHttp from 'chai-http';
import chai, {
  expect
} from 'chai';
import dotenv from 'dotenv';

import app from '../src/server';

dotenv.config();

chai.use(chaiHttp);

let token;

describe('Testing Follow System Controller', () => {
  describe('Testing follow and unfollow route controller', () => {
    const followRoute = '/api/v1/user/';

    // SIGN IN USER TO GET TOKEN
    it('should login user successfully', (done) => {
      const user = {
        email: 'john.doe@andela.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    // TEST FOLLOW
    it(
      'user should follow user',
      async () => {
        const response = await chai.request(app)
          .post(`${followRoute}follow/2`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'user should get followers',
      async () => {
        const response = await chai.request(app)
          .get(`${followRoute}followers/1`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'user should get followees',
      async () => {
        const response = await chai.request(app)
          .get(`${followRoute}followees/1`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'user can opt out from recieving notification from a follower',
      async () => {
        const response = await chai.request(app)
          .post(`${followRoute}notification/2`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'user should not follow themselves',
      async () => {
        const response = await chai.request(app)
          .post(`${followRoute}follow/1`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'if user does not exist',
      async () => {
        const response = await chai.request(app)
          .post(`${followRoute}follow/99000`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
      },
    );

    // UNFOLLOW TEST
    it(
      'user should unfollow user',
      async () => {
        const response = await chai.request(app)
          .post(`${followRoute}follow/2`)
          .set('token', token)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );
  });
});
