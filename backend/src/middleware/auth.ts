import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Access denied. No token provided.' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({ message: 'Token is not valid' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// export const optionalAuthenticate = async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//
//         if (token) {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//             const user = await User.findById(decoded.id).select('-password');
//             req.user = user || undefined;
//         }
//
//         next();
//     } catch (error) {
//         next();
//     }
// };
