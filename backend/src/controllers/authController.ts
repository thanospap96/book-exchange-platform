// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'fallback_dev_secret_change_in_production';
    return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// Simple try-catch wrapper
const handleAsync = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
export const register = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, location } = req.body;

    console.log("Received data", req.body)
    if (!firstName || !lastName || !email || !password || !location) {
        res.status(400).json({
            success: false, // ✅ ΠΡΟΣΘΗΚΗ
            message: 'All fields are required'
        });
        return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({
            success: false, // ✅ ΠΡΟΣΘΗΚΗ
            message: 'User already exists with this email'
        });
        return;
    }

    // Create new user
    const user = new User({
        firstName,
        lastName,
        email,
        password,
        location
    });

    await user.save();

    const token = generateToken((user._id as any).toString());

    res.status(201).json({
        success: true, // ✅ ΠΡΟΣΘΗΚΗ
        data: { // ✅ ΠΡΟΣΘΗΚΗ - τώρα το token και user είναι μέσα στο data
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                rating: user.rating
            }
        },
        message: 'User created successfully'
    });
});

export const login = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
        return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
        success: true,
        data: {
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                rating: user.rating
            }
        },
        message: 'Login successful'
    });
});
// export const register = handleAsync(async (req: Request, res: Response): Promise<void> => {
//     const { firstName, lastName, email, password, location } = req.body;
//
//     console.log("Received data", req.body)
//     if (!firstName || !lastName || !email || !password || !location) {
//         res.status(400).json({ message: 'All fields are required' });
//         return;
//     }
//
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         res.status(400).json({ message: 'User already exists with this email' });
//         return;
//     }
//
//     // Create new user
//     const user = new User({
//         firstName,
//         lastName,
//         email,
//         password,
//         location
//     });
//
//     await user.save();
//
//     const token = generateToken((user._id as any).toString());
//
//     res.status(201).json({
//         message: 'User created successfully',
//         token,
//         user: {
//             id: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             location: user.location,
//             rating: user.rating
//         }
//     });
// });
//
// export const login = handleAsync(async (req: Request, res: Response): Promise<void> => {
//     const { email, password } = req.body;
//
//     // Find user and verify password
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//         res.status(401).json({ message: 'Invalid email or password' });
//         return;
//     }
//
//     const token = generateToken((user._id as any).toString());
//
//     res.json({
//         message: 'Login successful',
//         token,
//         user: {
//             id: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             location: user.location,
//             rating: user.rating
//         }
//     });
// });

export const getProfile = handleAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const user = req.user;

    res.json({
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
            rating: user.rating,
            createdAt: user.createdAt
        }
    });
});

export const updateProfile = handleAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const user = req.user;
    const { firstName, lastName, location } = req.body;

    const updatedUser = await User.findById(user._id);

    if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    if (firstName) updatedUser.firstName = firstName;
    if (lastName) updatedUser.lastName = lastName;
    if (location) updatedUser.location = location;

    await updatedUser.save();

    res.json({
        message: 'Profile updated successfully',
        user: {
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            location: updatedUser.location,
            rating: updatedUser.rating
        }
    });
});