import React from 'react'
import { Paper, Typography, Box, Stack } from '@mui/material';

const ServerStatus = () => {
    return (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 5, border: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ position: 'relative', display: 'flex' }}>
                    <Box sx={{ 
                        width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50',
                        animation: 'pulse 2s infinite'
                    }} />
                    <style>{`
                        @keyframes pulse {
                            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                        }
                    `}</style>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>
                        SYSTEM STATUS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        All Systems Operational
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    )
}

export default ServerStatus