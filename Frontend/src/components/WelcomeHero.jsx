
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Stack, Button, Paper, Skeleton } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

const WelcomeHero = () => {

    // 1. States for dynamic data
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/users/dashboard/hero');
                setUserData(data);
            } catch (error) {
                console.error("Error fetching hero data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Current date logic
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 6, 
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <AutoAwesomeIcon sx={{ 
                    position: 'absolute', right: -20, top: -20, 
                    fontSize: 180, opacity: 0.1, transform: 'rotate(-15deg)' 
                }} />

                <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8, letterSpacing: 1.5 }}>
                        {today.toUpperCase()}
                    </Typography>
                    
                    {/* Dynamic Greeting */}
                    {loading ? (
                        <Skeleton variant="text" width={300} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    ) : (
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                            Welcome back, {userData?.name || 'Admin'}! 👋
                        </Typography>
                    )}

                    {/* Dynamic Stats Text */}
                    {loading ? (
                        <Box>
                            <Skeleton variant="text" width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ maxWidth: '600px', opacity: 0.9, lineHeight: 1.6 }}>
                            Your dashboard is up-to-date. In the last 24 hours, you have gained 
                            <strong> {userData?.newSubscribers} new subscribers </strong> and have 
                            <strong> {userData?.pendingPosts} pending posts </strong> waiting for your review.
                        </Typography>
                    )}

                    <Box sx={{ mt: 3 }}>
                        <Button 
                            component={Link} // Link component added
                            to="/analytics"  // Path for analytics page
                            variant="contained" 
                            endIcon={<ArrowForwardIcon />}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#1976d2', 
                                fontWeight: 800,
                                borderRadius: 3,
                                px: 3,
                                py: 1,
                                '&:hover': { bgcolor: '#f5f5f5' },
                                textTransform: 'none'
                            }}
                        >
                            View Analytics
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    )
}

export default WelcomeHero