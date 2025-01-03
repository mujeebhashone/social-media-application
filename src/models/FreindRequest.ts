import mongoose from 'mongoose';

interface IFriendRequest {
  senderId: string;
  receiverId: string;
  status: string;
}

const FriendRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

export default mongoose.model('FriendRequest', FriendRequestSchema);