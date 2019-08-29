import '@babel/polyfill';
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
      'should get all articles',
      async () => {
        const response = await chai.request(app)
          .get(article)
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
      },
    );
    it('should get all articles by id',
      async () => {
        const response = await chai.request(app)
          .get(`${article}user/1`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );
    it('should get all drafts by userId',
      async () => {
        const response = await chai.request(app)
          .get(`${article}user/draft/1`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );
    it('should get all published by userId',
      async () => {
        const response = await chai.request(app)
          .get(`${article}user/published/1`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );
  });
});
