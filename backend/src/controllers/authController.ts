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

    if (!firstName || !lastName || !email || !password || !location) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: 'User already exists with this email' });
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
        message: 'User created successfully',
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
            rating: user.rating
        }
    });
});

export const login = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            location: user.location,
            rating: user.rating
        }
    });
});

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
    const { username, location } = req.body;

    const updatedUser = await User.findById(user._id);

    if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    if (username) updatedUser.username = username;
    if (location) updatedUser.location = location;

    await updatedUser.save();

    res.json({
        message: 'Profile updated successfully',
        user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            location: updatedUser.location,
            rating: updatedUser.rating
        }
    });
});