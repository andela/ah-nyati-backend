import chai, { expect } from 'chai';
import nock from 'nock';
// import socialController from '../src/controllers/socialController';
// import chaiHttp from 'chai-http';
// import passport from 'passport';
// import server from '../src/server';
// import { MockStrategy, randomSocialUser } from './mockStrategy';
// import { userWithNoEmail } from './mockUser';
import { socialCallBack } from '../src/helpers/helpers';
import app from '../src/server';

const accessToken = 'vubhjnklmewrtyu';
const refreshToken = 'jhvbknhjnkmknkl';
const profile = {
  id: '1234567890',
  emails: [{ value: 'test@example.com' }],
  displayName: 'Nnamani Nzubechi',
  name:
   {
     familyName: 'Nzubechi',
     givenName: 'Nnamani'
   },
  provider: 'facebook',
  photos: [{ value: 'image' }],
};


nock('https://www.facebook.com/')
  .filteringPath(() => '/api/auth/facebook')
  .get('/api/auth/facebook')
  .reply(200, 'Facebook connection established');

describe('passport strategy', () => {
  it('should be a function', (done) => {
    // socialCallBack(accessToken, refreshToken, profile, done);
    expect(socialCallBack).to.be.a('function');
  });

  it('should call facebook route', async () => {
    const response = await chai.request(app).get('/api/auth/facebook');
    expect(response).to.have.status(200);
    expect(response.text).to.be.deep.equal('Facebook connection established');
  });
});

// chai.use(chaiHttp);

// describe('GET Social Login', () => {
//   describe('GET Social Login Auth Callback', () => {
//     it('should save a google user to the database', (done) => {
//       const app = chai.request(server).keepOpen();
//       app
//         .get('/api/auth/google/callback', socialCallBack, randomSocialUser)
//         .end((err, res) => {
//           if (err) {
//             done(err);
//           } else {
//             expect(app.redirects.length).to.equal(1);
//             expect(app.redirects[0].includes('/api/auth?token=')).to.equal(
//               true
//             );
//             const token = app.redirects[0].split('token=')[1];
//             app
//               .get('/api/user')
//               .set('authorization', token)
//               .end((secondErr, secondRes) => {
//                 const { user } = secondRes.body;
//                 expect(user.username).to.equal(randomSocialUser.displayName);
//                 expect(user.email).to.equal(randomSocialUser.emails[0].value);
//                 expect(user.image).to.equal(randomSocialUser.photos[0].value);
//                 expect(user.socialProvider).to.equal('google');
//                 done(secondErr);
//               });
//             expect(res.body).to.be.an('object');
//             expect(res.body).to.have.property('message').with.lengthOf(7);
//             expect(res.body).to.have.property('token');
//           }
//         });
//     });
//   });
// });
