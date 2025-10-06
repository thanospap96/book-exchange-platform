import User, { IUser } from '../models/User';

export const createUser = async (userData: {
    username: string;
    email: string;
    password: string;
    location: string;
}): Promise<IUser> => {
    const user = new User(userData);
    return await user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id).select('-password');
};

export const updateUserRating = async (userId: string, newRating: number): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(
        userId,
        { rating: newRating },
        { new: true, runValidators: true }
    ).select('-password');
};