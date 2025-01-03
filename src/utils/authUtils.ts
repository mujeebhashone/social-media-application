import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user: IUser | string, role: UserRole): string => {
  return jwt.sign({ userId: user || user, role: role }, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};