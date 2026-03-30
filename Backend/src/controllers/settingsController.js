
import Settings from '../models/Settings.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Get Site Settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne() || await Settings.create({ adminEmail: 'admin@test.com' });
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update General Settings
export const updateGeneralSettings = async (req, res) => {
    try {
        const updatedSettings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Profile & Security
export const updateProfile = async (req, res) => {
    const { firstName, lastName, bio, github, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id); // Auth middleware 

        if (!user) return res.status(404).json({ message: "User not found" });

        if (firstName !== undefined || lastName !== undefined) {
            const currentNameParts = user.name ? user.name.split(' ') : ['', ''];
            const fName = firstName !== undefined ? firstName : (currentNameParts[0] || '');
            const lName = lastName !== undefined ? lastName : (currentNameParts[1] || '');
            user.name = `${fName} ${lName}`.trim();
        }

        user.bio = bio || user.bio;
        user.github = github || user.github;

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};