
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    siteTitle: { type: String, default: 'SuperBlog Admin' },
    tagline: { type: String, default: '' },
    adminEmail: { type: String, required: true },
    maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;