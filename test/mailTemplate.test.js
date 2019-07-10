import chai from 'chai';
import mailTemplate from '../src/helpers/mail/mailTemplate/signupEmailTemplate';

chai.should();

describe('mailTemplate', () => {
  it('should return a html template', () => {
    const result = mailTemplate('codeBlock', 'www.codeBlock.com');
    result.should.be.a('string');
  });
});
