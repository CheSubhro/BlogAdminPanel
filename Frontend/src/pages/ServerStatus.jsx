import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Box, Typography, Paper, Grid, Stack, LinearProgress, 
    Chip, CircularProgress, Alert, useTheme, Avatar
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import DiscFullIcon from '@mui/icons-material/DiscFull';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import DnsIcon from '@mui/icons-material/Dns';

const ServerStatus = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    const fetchServerData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/server', config);
            setHealth(res.data);
            setError(null);
        } catch (err) {
            setError("Connection to monitor lost...");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServerData();
        const interval = setInterval(fetchServerData, 10000);
        return () => clearInterval(interval);
    }, [fetchServerData]);

    if (loading && !health) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <CircularProgress thickness={5} sx={{ color: '#6366f1' }} />
            </Box>
        );
    }

    const metrics = [
        { label: 'Processor', value: health?.cpuUsage, unit: '%', icon: <MemoryIcon />, color: '#6366f1', subText: 'System Load' },
        { label: 'Memory', value: health?.ramUsage, unit: '%', icon: <DiscFullIcon />, color: '#a855f7', subText: 'RAM in use' },
        { label: 'Latency', value: '24', unit: 'ms', icon: <SpeedIcon />, color: '#0ea5e9', subText: 'Network Ping', noBar: true },
    ];

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <DnsIcon sx={{ color: '#6366f1' }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                            System Infrastructure
                        </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        OS: <span style={{ fontWeight: 600 }}>{health?.platform}</span> • Refreshes every 10s
                    </Typography>
                </Box>
                <Chip 
                    label={health?.status} 
                    sx={{ 
                        bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, 
                        borderRadius: '10px', border: '1px solid #d1fae5' 
                    }} 
                    icon={<CheckCircleIcon style={{ color: '#10b981', fontSize: '18px' }} />}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }}>{error}</Alert>}

            {/* Metrics Cards */}
            <Grid container spacing={3}>
                {metrics.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper elevation={0} sx={{ 
                            p: 3, borderRadius: '24px', border: '1px solid #f1f5f9',
                            transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, borderRadius: '12px', width: 48, height: 48 }}>
                                    {item.icon}
                                </Avatar>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                        {item.value}{item.unit}
                                    </Typography>
                                </Box>
                            </Stack>

                            {!item.noBar ? (
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{item.subText}</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.value}%</Typography>
                                    </Stack>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={item.value > 100 ? 100 : item.value} 
                                        sx={{ 
                                            height: 8, borderRadius: 4, bgcolor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundImage: `linear-gradient(to right, ${item.color}, ${item.color}bb)` }
                                        }} 
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                                        Uptime: {health?.uptime} Hours Active
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}

                {/* Footer Operational Status */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ 
                        p: 3, borderRadius: '24px', 
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: '#fff', overflow: 'hidden', position: 'relative'
                    }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex' }}>
                                    <PublicIcon sx={{ color: '#38bdf8' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>All Systems Go</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.6 }}>Our global network is performing optimally.</Typography>
                                </Box>
                            </Stack>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#10b981' }}>99.9%</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Uptime Grade</Typography>
                            </Box>
                        </Stack>
                        
                        {/* Decorative Background Circle */}
                        <Box sx={{ 
                            position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', 
                            borderRadius: '50%', background: 'rgba(56, 189, 248, 0.05)' 
                        }} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ServerStatus;