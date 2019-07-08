import chai from 'chai';
import chaiHttp from 'chai-http';
import cronJob, { findAndDeactivateAllExpiredToken } from '../src/helpers/cronJobHelper';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('Run cron job function ', () => {
  it('cronJob should be a function ', () => {
    expect(cronJob).to.be.a('function');
  });
  it('findAndDeleteAllExpiredToken should be a function ', async () => {
    const expiredTokens = await findAndDeactivateAllExpiredToken();
    expect(findAndDeactivateAllExpiredToken).to.be.a('function');
    expect(expiredTokens).to.be.a('array');
  });
});
