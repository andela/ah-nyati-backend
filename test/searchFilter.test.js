import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('Get Articles controller', () => {
  const searchArticle = '/api/v1/searcharticles';
  it('should filter all articles by tag', (done) => {
    chai.request(app)
      .get(`${searchArticle}?tag=lagos`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('Article retrieved');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('articles');
        expect(res.body.data[0]).to.have.property('articleCount');
        done();
      });
  });

  it('should not filter articles by tag if the input is less than  3', (done) => {
    chai.request(app)
      .get(`${searchArticle}?tag=Jo`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Your search input must be greater than 3 letters');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return an error if tag does not exist', (done) => {
    chai.request(app)
      .get(`${searchArticle}?tag=test`)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.error).equal('The tag you selected does not exist');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should filter all articles by author', (done) => {
    chai.request(app)
      .get(`${searchArticle}?author=JohnDoe`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('Article retrieved');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('articles');
        expect(res.body.data[0]).to.have.property('articleCount');
        done();
      });
  });

  it('should not filter articles by author if the input is less than  3', (done) => {
    chai.request(app)
      .get(`${searchArticle}?author=Jo`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Your search input must be greater than 3 letters');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return an error if author does not exist', (done) => {
    chai.request(app)
      .get(`${searchArticle}?author=test`)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.error).equal('The author you selected has no article(s) at the moment, please check your input');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should filter all articles by category', (done) => {
    chai.request(app)
      .get(`${searchArticle}?category=Education`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('Article retrieved');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('articles');
        expect(res.body.data[0]).to.have.property('articleCount');
        done();
      });
  });

  it('should not filter articles by category if the input is less than  3', (done) => {
    chai.request(app)
      .get(`${searchArticle}?category=Jo`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Your search input must be greater than 3 letters');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return an error if category does not exist', (done) => {
    chai.request(app)
      .get(`${searchArticle}?category=test`)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.error).equal('The category you selected does not exist');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should filter all articles by title', (done) => {
    chai.request(app)
      .get(`${searchArticle}?title=Article`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('Article retrieved');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('articles');
        expect(res.body.data[0]).to.have.property('articleCount');
        done();
      });
  });

  it('should not filter articles by title if the input is less than  3', (done) => {
    chai.request(app)
      .get(`${searchArticle}?title=Jo`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Your search input must be greater than 3 letters');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return an error if title does not exist', (done) => {
    chai.request(app)
      .get(`${searchArticle}?title=test`)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.error).equal('The title you selected does not exist');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should filter all articles any random value', (done) => {
    chai.request(app)
      .get(`${searchArticle}?q=Article`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('Article retrieved');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('articles');
        expect(res.body.data[0]).to.have.property('articleCount');
        done();
      });
  });
  it('should not filter articles by user input if the input is less than  3', (done) => {
    chai.request(app)
      .get(`${searchArticle}?q=Jo`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Your search input must be greater than 3 letters');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return an error if no article is found for a random search', (done) => {
    chai.request(app)
      .get(`${searchArticle}?q=test`)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.error).equal('Your search does not exist');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should filter all articles if no parameter is passed', (done) => {
    chai.request(app)
      .get(searchArticle)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('Article retrieved');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('articles');
        expect(res.body.data[0]).to.have.property('articleCount');
        done();
      });
  });
});
