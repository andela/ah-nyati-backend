import chai from 'chai';
import authorize from '../src/middleware/authorize';

chai.should();

describe('authorize', () => {
  it('should return a function', () => {
    const result = authorize(['user', 'admin']);
    result.should.be.a('function');
  });
});
