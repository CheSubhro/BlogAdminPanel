import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Stack, Button, LinearProgress, Skeleton, Chip, Avatar } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MouseIcon from '@mui/icons-material/Mouse';
import TimerIcon from '@mui/icons-material/Timer';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 1. Fetching real data from your backend
                const [statsRes, chartRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/analytics/stats', config),
                    axios.get('http://localhost:5000/api/analytics/charts', config)
                ]);

                // 2. Mapping Backend Response to your UI structure
                const mappedData = {
                    metrics: [
                        { title: 'Total Posts', value: statsRes.data.totalPosts.toLocaleString(), grow: '+--%', iconType: 'trend', color: '#1976d2' },
                        { title: 'Total Users', value: statsRes.data.totalUsers.toLocaleString(), grow: '+--%', iconType: 'people', color: '#9c27b0' },
                        { title: 'Total Comments', value: statsRes.data.totalComments.toLocaleString(), grow: '+--%', iconType: 'mouse', color: '#2e7d32' },
                        { title: 'Pending', value: statsRes.data.pendingComments.toLocaleString(), grow: 'Action', iconType: 'timer', color: '#ed6c02' },
                    ],
                    // Keep mock for sources as your backend doesn't provide this yet
                    sources: [
                        { label: 'Direct', value: 45, color: '#1976d2' },
                        { label: 'Social Media', value: 30, color: '#9c27b0' },
                        { label: 'Organic Search', value: 15, color: '#2e7d32' },
                        { label: 'Referral', value: 10, color: '#ed6c02' },
                    ],
                    // Using real chart data (mapping 'posts' to 'visits' to match your AreaChart)
                    chartData: chartRes.data.map(item => ({
                        day: item.day,
                        visits: item.posts
                    }))
                };

                setAnalyticsData(mappedData);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const getIcon = (type) => {
        switch(type) {
            case 'people': return <PeopleOutlineIcon />;
            case 'timer': return <TimerIcon />;
            case 'trend': return <TrendingUpIcon />;
            case 'mouse': return <MouseIcon />;
            default: return <TrendingUpIcon />;
        }
    };

    const handleExport = () => {
        if (!analyticsData) return;
        const headers = ["Metric Name", "Value", "Growth Status"];
        const rows = analyticsData.metrics.map(item => 
            [item.title, item.value.replace(',', ''), item.grow]
        );
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Analytics_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, width: '100%', boxSizing: 'border-box' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-1px', color: '#1a1a1a' }}>
                        Analytics Insights
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Performance of CheSubhro's Blog
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    size="large"
                    disabled={loading} 
                    onClick={handleExport} 
                    startIcon={<FileDownloadIcon />}
                    sx={{ 
                        borderRadius: 4, px: 4, textTransform: 'none', fontWeight: 600,
                        bgcolor: '#1a1a1a', // Matched your theme
                        '&:hover': { bgcolor: '#333' }
                    }}
                >
                    {loading ? 'Processing...' : 'Export Report'}
                </Button>
            </Stack>

            <Grid container spacing={4} sx={{ mb: 5 }}>
                {(loading ? Array.from(new Array(4)) : analyticsData?.metrics).map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 7, border: '1px solid #eee' }}>
                            {loading ? (
                                <Box>
                                    <Skeleton variant="circular" width={50} height={50} sx={{ mb: 2 }} />
                                    <Skeleton variant="text" width="60%" height={40} />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            ) : (
                                <>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                                        <AvatarIconWrapper color={item.color}>{getIcon(item.iconType)}</AvatarIconWrapper>
                                        <ChipWrapper grow={item.grow} />
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.value.toLocaleString()}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6, letterSpacing: 1 }}>
                                        {item.title.toUpperCase()}
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={6}>
                <Grid item xs={12} lg={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid #eee' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Traffic Sources</Typography>
                        <Stack spacing={4}>
                            {(loading ? Array.from(new Array(4)) : analyticsData?.sources).map((source, i) => (
                                <Box key={i}>
                                    {loading ? ( <Skeleton variant="text" height={30} /> ) : (
                                        <>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 700 }}>{source.label}</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 900, color: source.color }}>{source.value}%</Typography>
                                            </Stack>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={source.value} 
                                                sx={{ 
                                                    height: 10, borderRadius: 5, bgcolor: '#f0f0f0',
                                                    '& .MuiLinearProgress-bar': { bgcolor: source.color, borderRadius: 5 }
                                                }} 
                                            />
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid #eee', height: '100%', minHeight: 450 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Post Growth</Typography>
                            <Chip label="Last 7 Days" size="small" sx={{ fontWeight: 700, bgcolor: '#f0f7ff', color: '#1976d2' }} />
                        </Stack>

                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 4 }} />
                        ) : (
                            <Box sx={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analyticsData?.chartData}>
                                        <defs>
                                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9e9e9e', fontSize: 12, fontWeight: 600 }} dy={10} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="visits" stroke="#1976d2" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

const AvatarIconWrapper = ({ children, color }) => (
    <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.cloneElement(children, { sx: { fontSize: 28 } })}
    </Box>
);

const ChipWrapper = ({ grow }) => {
    const isPositive = grow.startsWith('+');
    const isAction = grow === 'Action';
    return (
        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: isAction ? '#fff3e0' : (isPositive ? '#e8f5e9' : '#ffebee'), color: isAction ? '#ef6c00' : (isPositive ? '#2e7d32' : '#d32f2f') }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>{grow}</Typography>
        </Box>
    );
};

export default Analytics;