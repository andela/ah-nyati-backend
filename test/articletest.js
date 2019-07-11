import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';

import app from '../src/server';

dotenv.config();

chai.use(chaiHttp);

describe('Article Controller', () => {
  describe('Testing article controller', () => {
    const article = '/api/v1/articles/';
    it(
      'should get article',
      async () => {
        const response = await chai.request(app)
          .get(`${article}article`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'should not get article when nothing found',
      async () => {
        const response = await chai.request(app)
          .get(`${article}artic`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Article not found');
      },
    );
  });
});
