import '@babel/polyfill';
import chaiHttp from 'chai-http';
import chai, {
  expect
} from 'chai';
import dotenv from 'dotenv';

import {
  User
} from '../src/db/models';

import app from '../src/server';

dotenv.config();

chai.use(chaiHttp);

describe('Testing Password Reset Controller', () => {
  describe('Testing password reset controller', () => {
    const passwordResetAuth = '/api/v1/auth/';
    it(
      'should send password reset code',
      async () => {
        const response = await chai.request(app)
          .post(`${passwordResetAuth}sendResetToken`)
          .send({
            email: 'john.doe@andela.com'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('reset code successfully sent to email');
      },
    );

    it(
      'should not send password reset code if error email',
      async () => {
        const response = await chai.request(app)
          .post(`${passwordResetAuth}sendResetToken`)
          .send({
            email: 'john.doe@andela4.com'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body.message.email).to.equal('email does not exist');
      },
    );

    it(
      'should resend password reset code',
      async () => {
        const response = await chai.request(app)
          .post(`${passwordResetAuth}resendToken`)
          .send({
            email: 'john.doe@andela.com'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('reset code resent to your email');
      },
    );

    it(
      'should not resend password reset code if error email',
      async () => {
        const response = await chai.request(app)
          .post(`${passwordResetAuth}resendToken`)
          .send({
            email: 'john.doe@andela4.com'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body.message.email).to.equal('email does not exist');
      },
    );

    it(
      'should reset password',
      async () => {
        const user = await User.findOne({
          where: {
            email: 'john.doe@andela.com'
          }
        });
        const resetToken = user.verificationToken;
        const response = await chai.request(app)
          .post(`${passwordResetAuth}resetpassword?resetToken=${resetToken}`)
          .send({
            password: 'newpassword'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('password reset successful');
      },
    );

    it(
      'should not reset password if wrong/expired token',
      async () => {
        const response = await chai.request(app)
          .post(`${passwordResetAuth}resetpassword?resetToken=kkhg6739`)
          .send({
            password: 'newpassword'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(400);
        expect(response.body.message).to.equal('token has expired');
      },
    );
  });
});
