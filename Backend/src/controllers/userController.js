import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import transporter from '../config/mailConfig.js'

// GET /api/users
export const getUsers = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .limit(limit);
        
        const formattedUsers = await Promise.all(users.map(async (user) => {
            const postCount = await Post.countDocuments({ author: user._id });

            return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                posts: postCount || user.posts || 0, 
                img: user.name.charAt(0).toUpperCase(),
                avatar: user.avatar,
                createdAt: user.createdAt
            };
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// POST /api/users
export const inviteUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            name,
            email,
            role,
            password: 'password123', // Default password for invited users
            status: 'Active'
        });

        if (user) {
            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                posts: user.posts,
                img: user.name.charAt(0).toUpperCase()
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Invite failed", error: error.message });
    }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role || user.role;
        user.status = req.body.status || user.status;

        const updatedUser = await user.save(); 

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            role: updatedUser.role,
            status: updatedUser.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  DELETE /api/users/:id
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Role Distribution for Charts
export const getRoleDistribution = async (req, res) => {
    try {
        // MongoDB Aggregation to group by role
        const distribution = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    value: { $sum: 1 }
                }
            }
        ]);

        const roleColors = {
            'Administrator': '#d32f2f',
            'Editor': '#1976d2',
            'Author': '#2e7d32',
            'Contributor': '#ed6c02'
        };

        const formattedData = distribution.map(item => ({
            name: item._id || 'User',
            value: item.value,
            color: roleColors[item._id] || '#9c27b0'
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching distribution", error: error.message });
    }
};

// @desc    Get Hero Section Summary (Last 24h stats)
export const getHeroStats = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const newSubscribers = await User.countDocuments({ 
            createdAt: { $gte: twentyFourHoursAgo } 
        });

        const pendingPosts = await Post.countDocuments({ status: 'Draft' });

        res.status(200).json({
            name: "CheSubhro", 
            newSubscribers: newSubscribers || 0,
            pendingPosts: pendingPosts || 0
        });
    } catch (error) {
        res.status(500).json({ message: "Hero stats failed", error: error.message });
    }
};

// @desc    Global Search for Users and Posts
export const globalSearch = async (req, res) => {
    const { query } = req.query;

    try {
        if (!query) return res.status(200).json({ users: [], posts: [] });

        const searchQuery = { $regex: query, $options: 'i' };

        const users = await User.find({ name: searchQuery }).limit(5).select('name role');
        const posts = await Post.find({ title: searchQuery }).limit(5).select('title slug');

        res.status(200).json({ users, posts });
    } catch (error) {
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};

// POST /api/users/send-mail
export const sendUserEmail = async (req, res) => {
    const { to, subject, message } = req.body;

    try {
        const mailOptions = {
            from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: message, 
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #1976d2;">Message from Admin</h2>
                    <p>${message}</p>
                </div>`, 
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Email sending failed", error: error.message });
    }
};