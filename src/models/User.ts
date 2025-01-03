import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  profilePhoto: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    profilePhoto: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },

   
    phoneNumber: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

export default mongoose.model<IUser>('User', UserSchema);
