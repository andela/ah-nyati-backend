import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';

import { User } from '../src/db/models';

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
            email: 'john.doe2@andela.com'
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
            email: 'john.doe2@andela4.com'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal('Email does not exist');
      },
    );

    it(
      'should resend password reset code',
      async () => {
        const response = await chai.request(app)
          .post(`${passwordResetAuth}sendResetToken`)
          .send({
            email: 'john.doe2@andela.com'
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('A reset code has been resent to your email');
      },
    );

    it(
      'should reset password',
      async () => {
        const user = await User.findOne({
          where: {
            email: 'john.doe2@andela.com'
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
        expect(response.body.message).to.equal('Password reset successful');
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
        expect(response.body.message).to.equal('invalid token');
      },
    );
  });
});
