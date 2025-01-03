import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';
import { CustomError } from '../utils/customError';
import { UserRole } from '../models/User';



export const auth = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log('Token:', token); // Log token

    if (!token) {
      throw new CustomError('Access denied. No token provided.', 401);
    }

    try {
      const decoded = verifyToken(token) as { userId: string; role: UserRole };
      console.log('Decoded Token:', decoded); // Log decoded token

      req.user = { id: decoded.userId, role: decoded.role };

      // Check if user role is allowed
      if (!roles.includes(decoded.role)) {
        throw new CustomError('Access denied. You do not have permission.', 403);
      }

      next();
    } catch (err) {
      console.error('Error:', err); // Log error
      throw new CustomError('Invalid token.', 401);
    }
  };
};