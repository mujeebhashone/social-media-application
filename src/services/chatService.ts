import Message from '../models/Message';

export const sendMessage = async (
  sender: string,
  receiver: string,
  content: string,
  type: string  
) => {
  const message = new Message({ sender, receiver, content, type });
  await message.save();
  return message;
};

export const markMessageAsRead = async (messageId: string) => {
  const message = await Message.findByIdAndUpdate(
    messageId,
    { read: true },
    { new: true }
  );
  return message;
};

export const getMessages = async (userId: string, otherUserId: string) => {
  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  }).sort({ createdAt: 1 });
  return messages;
};