import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Comment } from '../src/db/models';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let testToken;

describe('CommentArticleController', () => {
  it('should login user successfully', done => {
    const user = {
      email: 'john.doe@andela.com',
      password: 'password',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        testToken = res.body.token;
        res.should.have.status(200);
        expect(res.body.message).equal('User Login successful');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('status');
        done();
      });
  });
  it('should create a comment successfully', done => {
    const comment = {
      commentBody: 'I enjoy reading your articles. Please write more',
    };
    chai
      .request(app)
      .post('/api/v1/articles/article/comments')
      .send(comment)
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.message).equal('Comment added successfully');
        expect(res.body.data[0]).to.have.property('createdAt');
        expect(res.body.data[0]).to.have.property('updatedAt');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0]).to.have.property('author');
        expect(res.body.data[0]).to.have.property('updatedAt');
        expect(res.body.data[0].author).to.have.property('userName');
        expect(res.body.data[0].author).to.have.property('bio');
        expect(res.body.data[0].author).to.have.property('imageUrl');
        expect(res.body.data[0].author).to.be.a('object');
        done();
      });
  });
  it('should fail to create a comment when the slug is wrong', done => {
    const comment = {
      commentBody: 'I enjoy reading your articles. Please write more',
    };
    chai
      .request(app)
      .post('/api/v1/articles/articlenb/comments')
      .send(comment)
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).equal('Article not found');
        done();
      });
  });
  it('should fail to create a comment when comment body is not provided', done => {
    const comment = {
      commentBody: '',
    };
    chai
      .request(app)
      .post('/api/v1/articles/article/comments')
      .send(comment)
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.status).equal(400);
        expect(res.body.message).to.be.an('object');
        expect(res.body.message.commentBody).to.be.a('string');
        expect(res.body.message.commentBody).equal('Comment body is required.');
        done();
      });
  });
  it('should fail to create a comment when comment body is not provided', done => {
    const comment = {};
    chai
      .request(app)
      .post('/api/v1/articles/article/comments')
      .send(comment)
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.status).equal(400);
        expect(res.body.message).to.be.a('object');
        expect(res.body.message).to.be.a('object');
        expect(res.body.message.commentBody).to.be.a('string');
        expect(res.body.message.commentBody).equal(
          'Comment body is required.'
        );
        done();
      });
  });
  it('should fail to create a comment when token is not provided', done => {
    const comment = {
      commentBody: 'This is the body',
    };
    chai
      .request(app)
      .post('/api/v1/articles/article/comments')
      .send(comment)
      .set('token', '')
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).equal('Token is not provided!');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should fail to create a comment when token is invalid', done => {
    const comment = {
      commentBody: 'This is the body',
    };
    chai
      .request(app)
      .post('/api/v1/articles/article/comments')
      .send(comment)
      .set('token', `${testToken}k`)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).equal('Invalid token provided');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  before(' Populate the comment table', async () => {
    try {
      const comment = [
        {
          commentBody: 'I would like to dance in the rain',
          userId: 1,
          articleId: 1,
        },
      ];
      await Comment.bulkCreate(comment);
    } catch (error) {
      return error.message;
    }
  });
  it('should get all comments for a particular article successfully', done => {
    chai
      .request(app)
      .get('/api/v1/articles/article/comments?currentPage=1&limit=1')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('All comments fetched successfully');
        expect(res.body.data[0]).to.have.property('articleId');
        expect(res.body.data[0]).to.have.property('comments');
        expect(res.body.data[0]).to.have.property('totalPages');
        expect(res.body.data[0]).to.have.property('currentPage');
        expect(res.body.data[0]).to.have.property('limit');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0].comments[0]).to.have.property('commentBody');
        expect(res.body.data[0].comments[0]).to.have.property('createdAt');
        expect(res.body.data[0].comments[0]).to.have.property('id');
        expect(res.body.data[0].comments).to.be.a('array');
        done();
      });
  });
  it('should get all comments for a particular article successfully', done => {
    chai
      .request(app)
      .get('/api/v1/articles/article/comments')
      .set('token', testToken)
      .end((err, res) => {
        
        res.should.have.status(200);
        expect(res.body.message).equal('All comments fetched successfully');
        expect(res.body.data[0]).to.have.property('articleId');
        expect(res.body.data[0]).to.have.property('comments');
        expect(res.body).to.have.property('status');
        expect(res.body.data[0].comments[0]).to.have.property('commentBody');
        expect(res.body.data[0].comments[0]).to.have.property('createdAt');
        expect(res.body.data[0].comments[0]).to.have.property('id');
        expect(res.body.data[0].comments).to.be.a('array');
        done();
      });
  });
  it('should fail to like a comment when the comment does not exist', done => {
    chai
      .request(app)
      .post('/api/v1/articles/comments/29999/like')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).equal('Comment not found');
        done();
      });
  });
  it('should like a comment successfully', done => {
    chai
      .request(app)
      .post('/api/v1/articles/comments/1/like')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.message).equal('You just liked this comment');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should fail to like a comment if comment Id is invalid', done => {
    chai
      .request(app)
      .post('/api/v1/articles/comments/w/like')
      .set('token', testToken)
      .end((err, res) => {        
        res.should.have.status(400);
        expect(res.body.message.id).equal('Comment Id must be an integer');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.have.property('id');
        expect(res.body.message.id).equal('Comment Id must be an integer');
        expect(res.body.message).to.be.a('object');
        expect(res.body.message.id).to.be.a('string');
        done();
      });
  });
  it('should fail to like a comment if the user already liked it', done => {
    chai
      .request(app)
      .post('/api/v1/articles/comments/1/like')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).equal('You just unliked this comment');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fetch a specific comment', (done) => {
    chai.request(app).get('/api/v1/articles/comments/1')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.data[0]).to.have.property('articleId');
        expect(res.body.data[0]).to.have.property('comment');
        done();
      });
  });

  it('should indicate that a comment does not exist', (done) => {
    chai.request(app).get('/api/v1/articles/comments/100')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).to.equal('Comment not found');
        done();
      });
  });

  it('should return an empty edit history of a comment', (done) => {
    chai.request(app).get('/api/v1/articles/comments/1/history')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('This comment has not been edited');
        expect(res.body.data[0]).to.have.property('comment');
        expect(res.body.data[0]).to.have.property('articleId');
        expect(res.body.data[0]).to.have.property('editHistory');
        expect(res.body.data[0]).to.have.property('updatedAt');
        expect(res.body.data[0].editHistory.length).to.equal(0);
        done();
      });
  });

  it('should update a comment', (done) => {
    chai.request(app).patch('/api/v1/articles/comments/1')
    .send({commentBody: 'Hello! I am the edited comment'})
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.data[0]).to.have.property('articleId');
        expect(res.body.data[0].comment.commentBody).to.equal('Hello! I am the edited comment');
        expect(res.body.message).to.equal('Comment updated successfully');
        done();
      });
  });

  it('should fetch the edit history of a comment', (done) => {
    chai.request(app).get('/api/v1/articles/comments/1/history')
      .set('token', testToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.data[0]).to.have.property('comment');
        expect(res.body.data[0]).to.have.property('articleId');
        expect(res.body.data[0]).to.have.property('editHistory');
        expect(res.body.data[0]).to.have.property('updatedAt');
        done();
      });
  });
});
