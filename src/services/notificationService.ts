import Notification from '../models/Notification';

export const createNotification = async (
  userId: string,
  type: string,
  message: string
) => {
  const notification = new Notification({ userId, type, message });
  await notification.save();
  return notification;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
  return notification;
};

export const getUserNotifications = async (userId: string) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  return notifications;
};