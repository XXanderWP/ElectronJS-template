import { Notification } from 'electron';
import path from 'path';

export const ShowNotification = (title: string, body: string) => {
  const notification = new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, 'icon.png'),
    silent: false,
  });

  notification.show();
};
