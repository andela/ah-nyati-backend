import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';

import app from '../src/server';

dotenv.config();

chai.use(chaiHttp);

describe('Category Controller', () => {
  describe('Testing category controller', () => {
    const category = '/api/v1/categories/';
    it(
      'should get all categories',
      async () => {
        const response = await chai.request(app)
          .get(category)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message');
      },
    );

    it(
      'should not get category when nothing found',
      async () => {
        const response = await chai.request(app)
          .get(`${category}artic`)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('errors');
      },
    );
  });
});
