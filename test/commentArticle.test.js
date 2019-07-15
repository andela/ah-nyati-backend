import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let token;

describe('CommentArticleController', () => {
  it('should login user successfully', (done) => {
    const user = {
      email: 'john.doe@andela.com',
      password: 'password',
    };
    chai.request(app).post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        expect(res.body.message).equal('User Login successful');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('status');
        done();
      });
  });
  it('should create a comment successfully', (done) => {
    const comment = {
      commentBody: 'I enjoy reading your articles. Please write more',
    };
    chai.request(app).post('/api/v1/article/article/comments')
      .send(comment)
      .set('token', token)
      .end((err, res) => {        
        res.should.have.status(201);
        expect(res.body.message).equal('Comment Added Successfully');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('author');
        expect(res.body).to.have.property('updatedAt');
        expect(res.body.author).to.have.property('userName');
        expect(res.body.author).to.have.property('bio');
        expect(res.body.author).to.have.property('imageUrl');
        expect(res.body.author).to.be.a('object');
        done();
      });
  });
  it('should fail to create a comment when the slug is wrong', (done) => {
    const comment = {
      commentBody: 'I enjoy reading your articles. Please write more',
    };
    chai.request(app).post('/api/v1/article/articlenb/comments')
      .send(comment)
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).equal('Article not found');
        done();
      });
  });
  it('should fail to create a comment when comment body is not provided', (done) => {
    const comment = {
      commentBody: '',
    };
    chai.request(app).post('/api/v1/article/article/comments')
      .send(comment)
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Invalid request');
        expect(res.body.message).to.be.a('string');
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors.commentBody).to.be.a('array');
        expect(res.body.errors.commentBody[0]).equal('Comment body is required.');
        done();
      });
  });
  it('should fail to create a comment when comment body is not provided', (done) => {
    const comment = {
    };
    chai.request(app).post('/api/v1/article/article/comments')
      .send(comment)
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).equal('Invalid request');
        expect(res.body.message).to.be.a('string');
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors.commentBody).to.be.a('array');
        expect(res.body.errors.commentBody[0]).equal('Comment body is required.');
        done();
      });
  });
  it('should fail to create a comment when token is not provided', (done) => {
    const comment = {
      commentBody: 'This is the body',
    };
    chai.request(app).post('/api/v1/article/article/comments')
      .send(comment)
      .set('token', '')
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.error).equal('token is not provided!');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should fail to create a comment when token is invalid', (done) => {
    const comment = {
      commentBody: 'This is the body',
    };
    chai.request(app).post('/api/v1/article/article/comments')
      .send(comment)
      .set('token', `${token}k`)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.error).equal('Invalid token provided');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
