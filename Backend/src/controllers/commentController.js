
import Comment from '../models/Comment.js';

// Get All Comments
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Comments
export const createComment = async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update Comment Status (Approve/Spam)
export const updateStatus = async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin Reply logic
export const adminReply = async (req, res) => {
    const { replyText } = req.body;
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id, 
            { 
                adminReply: replyText, 
                status: 'Approved' 
            }, 
            { new: true }
        );
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete Comment
export const deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark All as Read (Approve All)
export const approveAll = async (req, res) => {
    try {
        await Comment.updateMany({ status: 'Pending' }, { status: 'Approved' });
        res.status(200).json({ message: "All comments approved" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};