import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    genre: string;
    condition: 'New' | 'Like New' | 'Good' | 'Fair';
    description: string;
    owner: mongoose.Types.ObjectId;
    status: 'available' | 'pending' | 'exchanged';
    imageUrl: string;
    createdAt: Date;
}

const BookSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    author: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    genre: {
        type: String,
        required: true,
        enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Fantasy', 'Biography', 'History', 'Children', 'Other']
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair']
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'exchanged'],
        default: 'available'
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

BookSchema.index({ title: 'text', author: 'text', genre: 1 });

export default mongoose.model<IBook>('Book', BookSchema);