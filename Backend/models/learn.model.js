import { Schema, model } from 'mongoose';

// FlashCard schema for Q&A pairs
const flashCardSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    }
});

// Learn material schema
const learnSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    transcript: {
        type: String,
        required: false,
        trim: true
    },
    summary: {
        type: String,
        required: false,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    flashCards: [flashCardSchema],
    cloudinaryContentUrl: {
        type: String,
        required: false,
        trim: true
    },
    contentType: {
        type: String,
        enum: ['youtube', 'video', 'audio', 'document', 'other'],
        default: 'other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true });

const Learn = model('Learn', learnSchema);

export default Learn;
