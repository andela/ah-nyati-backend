import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import config from '../../db/config/config';

const { sendgrid } = config;

const transport = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: sendgrid
}));

const sendEmail = {
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
