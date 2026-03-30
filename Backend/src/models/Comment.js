
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true 
    },
    initials: { 
        type: String, 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    post: { 
        type: String, 
        required: true 
    }, // Post title or ID
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Spam'], 
        default: 'Pending' 
    },
    adminReply: { 
        type: String, 
        default: '' 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;