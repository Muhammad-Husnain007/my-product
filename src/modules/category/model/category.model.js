import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        enum: ['plumber']
    },
    active: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    del: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const CategoryModel = mongoose.model('Category', categorySchema);
