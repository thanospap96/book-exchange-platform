import mongoose, { Document, Schema } from 'mongoose';

export interface IExchange extends Document {
    book: mongoose.Types.ObjectId;
    requester: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    message?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

const ExchangeSchema: Schema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    message: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});


ExchangeSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model<IExchange>('Exchange', ExchangeSchema);