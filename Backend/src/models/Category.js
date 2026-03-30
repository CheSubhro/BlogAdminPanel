
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    color: { type: String, default: '#1976d2' }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);