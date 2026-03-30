
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    img: { type: String, required: true }, // Cloudinary URL
    title: { type: String },
    public_id: { type: String, required: true }, // Cloudinary file ID
}, { timestamps: true });

export default mongoose.model('Media', mediaSchema);