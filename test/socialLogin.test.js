import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import socialController from '../src/controllers/socialController';
import { randomSocialUser, randomTwitterUser } from './mockSocialUser';
import { User } from '../src/db/models';

chai.use(sinonChai);

describe('GET Social Login', () => {
  const dbResponse = [
    {
      dataValues: {
        id: 1,
        userName: 'Nzube',
        email: 'test@example.com',
        createdAt: '24 09 2019',
        updatedAt: '24 09 2019'
      }
    },
  ];

  let response;
  beforeEach(() => {
    response = {
      status() {},
      json() {}
    };
    sinon.stub(response, 'status').returnsThis();
    sinon.spy(response, 'json');
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should save new google or facebookuser to the database', async () => {
    const request = {
      authInfo: randomSocialUser
    };
    sinon.stub(User, 'findOrCreate').returns(dbResponse);
    await socialController.socialUser(request, response);
    expect(response.status).to.have.been.calledWith(200);
    expect(response.json.calledOnce).to.eql(true);
  });

  it('should save a new twitter user to the database', async () => {
    const request = {
      authInfo: randomTwitterUser
    };
    sinon.stub(User, 'findOrCreate').returns(dbResponse);
    await socialController.socialUser(request, response);
    expect(response.status).to.have.been.calledWith(200);
    expect(response.json.calledOnce).to.eql(true);
  });

  it('should not save a new twitter user to the database', async () => {
    const request = {
      authInfo: randomTwitterUser
    };
    sinon.stub(User, 'findOrCreate').throws(() => new Error('This is an error'));
    await socialController.socialUser(request, response);
    expect(response.status).to.have.been.calledWith(500);
    expect(response.json.calledOnce).to.eql(true);
    expect(response.json).to.have.been.calledWith({
      status: 500,
      message: 'This is an error'
    });
  });
});
