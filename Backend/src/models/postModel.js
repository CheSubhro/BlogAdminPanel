
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true }, // For URL
    content: { type: Object, required: true }, // JSON data save in Editor.js  
    image: { type: String, required: true }, // Cloudinary URL
    cloudinary_id: String, // Public ID: BloggingPanel/abc12345
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true
  },
    tags: [{ type: String }], // Array of strings
    status: { 
      type: String, 
      enum: ['Published', 'Draft'], 
      default: 'Draft',
      index: true 
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;