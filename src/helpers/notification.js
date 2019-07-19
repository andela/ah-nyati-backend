import { notification } from '../db/models';
import sendEmail from './mail/mailer';
import findItem from './findItem';
import config from '../db/config/config';

const { isTest } = config;


const userNotification = async (userId, message) => {
  const user = await findItem.getUser(userId);

  // SEND IF USER EMAIL NOTIFICATION IS TRUE (ON)
  if (user.emailNotification) {
    if (!isTest) {
      await sendEmail
        .sendEmail(
          'do_not_reply@authorhaven.com',
          user.email,
          'Notification',
          message
        );
    }
  }

  const isRead = false;
  await notification.create({
    userId,
    message,
    isRead
  })
};

export default userNotification;
