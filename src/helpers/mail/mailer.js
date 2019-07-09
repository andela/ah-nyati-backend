import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import { sendgrid } from '../../db/config/config';

const transport = nodemailer.createTransport(
  nodemailerSendgrid(
    {
      apiKey: sendgrid
    }
  )
);

/**
 *
 *
 * @description SendEmail Controller
 * @class SendEmail
 */
const sendEmail = {
  /**
  *
  *@description Send Email method
  * @static
  * @param {object} from
  * @param {object} to
  * @param {object} subject
  * @param {object} html
  * @returns {object} res
  * @memberof SendEmail
  */
  async sendEmail(from, to, subject, html) {
    const sMail = await transport.sendMail({
      from,
      to,
      subject,
      html
    });
    return sMail;
  },
};

export default sendEmail;
