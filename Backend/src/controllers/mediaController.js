import { v2 as cloudinary } from 'cloudinary';
import Media from '../models/Media.js';

// Get all media items
export const getAllMedia = async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle Upload and Save to DB
export const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const newMedia = new Media({
            img: req.file.path, // Cloudinary URL
            public_id: req.file.filename, // Cloudinary ID
            title: req.file.originalname
        });

        const savedMedia = await newMedia.save();
        res.status(201).json(savedMedia);
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};

// Delete Media from DB 
export const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({ message: "Image not found" });
        }
        await cloudinary.uploader.destroy(media.public_id);

        await Media.findByIdAndDelete(id);

        res.status(200).json({ message: "Deleted successfully from Cloudinary and DB" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Delete failed", error });
    }
};