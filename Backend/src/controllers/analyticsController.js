
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Comment from '../models/Comment.js';

// Analytics Summary Stats
export const getStats = async (req, res) => {
    try {
        const [posts, users, comments, pending] = await Promise.all([
            Post.countDocuments(),
            User.countDocuments(),
            Comment.countDocuments(),
            Comment.countDocuments({ status: 'Pending' })
        ]);

        res.status(200).json({
            totalPosts: posts,
            totalUsers: users,
            totalComments: comments,
            pendingComments: pending
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetches analytics for the growth chart (Last 7 Days)
 * Returns post counts grouped by day of the week.
 */
export const getChartData = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await Post.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" }, 
                    count: { $sum: 1 }
                }
            }
        ]);

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const statsMap = stats.reduce((acc, curr) => {
            acc[dayNames[curr._id - 1]] = curr.count;
            return acc;
        }, {});

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = dayNames[d.getDay()];

            last7Days.push({
                day: dayName,
                posts: statsMap[dayName] || 0 
            });
        }

        res.status(200).json(last7Days);

    } catch (error) {
        console.error("Chart Data Error:", error);
        res.status(500).json({ message: "Failed to fetch chart data", error: error.message });
    }
};