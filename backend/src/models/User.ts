import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    firsltName: string;
    lastName: string;
    password: string;
    location: string;
    rating: number;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true },


    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true },

    // username: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true,
    //     minlength: 3,
    //     maxlength: 30
    // },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 0,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Type assertion για το this.password
    const password = this.password as string;
    this.password = await bcrypt.hash(password, 12);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(
    candidatePassword: string
): Promise<boolean> {
    // Type assertion για το this.password
    const password = this.password as string;
    return await bcrypt.compare(candidatePassword, password);
};

export default mongoose.model<IUser>('User', UserSchema);