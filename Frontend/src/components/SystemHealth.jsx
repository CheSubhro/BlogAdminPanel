import React from 'react'
import { Paper, Typography, Box, Stack, LinearProgress } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

const SystemHealth = () => {
    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0' }}>
            {/* Live Server Pulse Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ position: 'relative', display: 'flex' }}>
                        {/* The Animated Dot */}
                        <Box sx={{ 
                            width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50',
                            position: 'relative', zIndex: 1
                        }} />
                        <Box sx={{ 
                            width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50',
                            position: 'absolute', animation: 'pulse-animation 2s infinite',
                            zIndex: 0
                        }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Server Status</Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#4caf50' }}>ACTIVE</Typography>
            </Stack>

            <style>{`
                @keyframes pulse-animation {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(3.5); opacity: 0; }
                }
            `}</style>

            {/* Storage Pulse Section */}
            <Box sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <StorageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>Database Storage</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>72%</Typography>
                </Stack>
                <LinearProgress 
                    variant="determinate" 
                    value={72} 
                    sx={{ 
                        height: 6, borderRadius: 3, bgcolor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)'
                        }
                    }} 
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', fontSize: '10px' }}>
                    1.2GB of 2GB used (Strapi Assets)
                </Typography>
            </Box>
        </Paper>
    )
}

export default SystemHealth