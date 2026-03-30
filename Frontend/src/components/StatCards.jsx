// Stat Cards

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Box, Typography, Avatar, Skeleton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import InsightsIcon from '@mui/icons-material/Insights';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'; // Comments
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Pending


const StatsCards = () => {

    //  Initialize state as null or empty array
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/analytics/stats');

                // Backend Object UI convert array
                const formattedStats = [
                    { 
                        title: 'Total Users', 
                        value: data.totalUsers, 
                        growth: '+10%', 
                        icon: <PeopleIcon />, 
                        color: '#1976d2', 
                        bg: '#e3f2fd' 
                    },
                    { 
                        title: 'Total Posts', 
                        value: data.totalPosts, 
                        growth: '+5%', 
                        icon: <PostAddIcon />, 
                        color: '#2e7d32', 
                        bg: '#e8f5e9' 
                    },
                    { 
                        title: 'Total Comments', 
                        value: data.totalComments, 
                        growth: '+2%', 
                        icon: <ChatBubbleIcon />, 
                        color: '#ed6c02', 
                        bg: '#fff3e0' 
                    },
                    { 
                        title: 'Pending Comments', 
                        value: data.pendingComments, 
                        growth: 'Action required', 
                        icon: <HourglassEmptyIcon />, 
                        color: '#d32f2f', 
                        bg: '#ffebee' 
                    },
                ];

                setStats(formattedStats);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Grid container spacing={3} sx={{ mb: 4, width: '100%', margin: 0 }}>
            {(loading ? Array.from(new Array(4)) : stats).map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            borderRadius: '16px', 
                            border: '1px solid #eff2f5',
                            height: '100%',
                            transition: 'transform 0.2s',
                            '&:hover': item ? { 
                                transform: 'translateY(-4px)', 
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)' 
                            } : {}
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                {item ? (
                                    <>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ color: '#9097a7', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: '#1a2035' }}>
                                            {item.value.toLocaleString()} 
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: item.title === 'Pending Comments' ? '#d32f2f' : '#2e7d32', 
                                                fontWeight: 700,
                                            }}
                                        >
                                            {item.growth}
                                        </Typography>
                                    </>
                                ) : (
                                    <Box sx={{ pt: 0.5 }}>
                                        <Skeleton variant="text" width="50%" height={20} />
                                        <Skeleton variant="text" width="80%" height={50} />
                                        <Skeleton variant="text" width="40%" height={20} />
                                    </Box>
                                )}
                            </Box>

                            {item ? (
                                <Avatar 
                                    sx={{ 
                                        bgcolor: item.bg, 
                                        color: item.color, 
                                        borderRadius: '12px', 
                                        width: 48, 
                                        height: 48, 
                                        ml: 2 
                                    }}
                                >
                                    {item.icon}
                                </Avatar>
                            ) : (
                                <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: '12px', ml: 2 }} />
                            )}
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsCards;