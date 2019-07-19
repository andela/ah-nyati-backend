import { Pool } from 'pg';
import { parse } from 'pg-connection-string';
import debug from 'debug';
import Pusher from 'pusher';
import { DATABASE_URL, appId, key, secret, cluster } from '../config/config';

const conString = parse(DATABASE_URL);

const pool = new Pool(conString);

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true
});


pool.connect((err, client) => {
  client.on('notification', (msg) => {
    pusher.trigger('watch_notification',
      'new_notification', JSON.parse(msg.payload));
  });
  client.query('LISTEN watch_notification');
});

const notifyFunction = `
CREATE OR REPLACE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('watch_notification', row_to_json(NEW)::text);
  RETURN new;
END;
$$ LANGUAGE plpgsql;`;

const notificationTrigger = `
DROP TRIGGER IF EXISTS notification_trigger ON notifications;
CREATE TRIGGER notification_trigger AFTER INSERT ON notifications
FOR EACH ROW EXECUTE PROCEDURE notify_trigger()`;

module.exports = () => {
  try {
    return (async () => {
      const client = await pool.connect();
      try {
        await client.query(notifyFunction);
        await client.query(notificationTrigger);
      } finally {
        client.release();
      }
    })();
  } catch (e) {
    return debug('query')(e.stack); 
  }
}
