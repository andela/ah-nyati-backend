import '@babel/polyfill';
import chaiHttp from 'chai-http';
import chai, {
  expect
} from 'chai';
import dotenv from 'dotenv';

import app from '../src/server';

dotenv.config();

chai.use(chaiHttp);

describe('Testing Follow System Controller', () => {
  describe('Testing follow and unfollow route controller', () => {
    const followRoute = '/api/user/';
    const authRoute = '/api/auth/';

    // TEST FOLLOW
    it(
      'user should follow user',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/follow/1?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body.data).to.equal('you just followed this user');
      },
    );

    it(
      'user should not follow if already follow',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/follow/1?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body.data.follow).to.equal('you are already following this user');
      },
    );

    it(
      'user should not follow themselves',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/follow/2?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body.data.follow).to.equal('you can not follow yourself');
      },
    );

    it(
      'if user does not exist',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/follow/7?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body.data.user).to.equal('user does not exist');
      },
    );

    // UNFOLLOW TEST
    it(
      'user should unfollow user',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/unfollow/1?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body.data).to.equal('you just unfollowed this user');
      },
    );

    it(
      'if user is not following a user',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/unfollow/2?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body.data.follow).to.equal('you are not following this user');
      },
    );

    it(
      'if user does not exist',
      async () => {
        const res = await chai.request(app)
          .post(`${authRoute}/mockToken`)
          .send();
        const token = res.body.data;
        const response = await chai.request(app)
          .post(`${followRoute}/unfollow/7?resetToken=${token}`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body.data.user).to.equal('user does not exist');
      },
    );
  });
});
