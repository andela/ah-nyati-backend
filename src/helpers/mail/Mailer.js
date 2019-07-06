import nodemailer from 'nodemailer';
import config from '../../db/config/config';

const { mailConfig } = config;

/**
 *
 *
 * @class Mailer
 */
class Mailer {
  /**
   *
   *
   *
   * @static
   * @param {*} payload
   * @returns {promise} info
   * @memberof Mailer
   */
  static async sendMail(payload) {
    try {
      const { to, subject, html } = payload;
      const mailOptions = {
        to, subject, html
      };
      const transporter = await nodemailer.createTransport(mailConfig);
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      return err;
    }
  }
}
export default Mailer;
