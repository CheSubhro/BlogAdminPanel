// chart logic

import React from 'react';
import { Grid, Paper, Typography, Box, Stack, IconButton } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const trafficData = [
    { name: 'Mon', views: 3200 }, { name: 'Tue', views: 4500 },
    { name: 'Wed', views: 4100 }, { name: 'Thu', views: 5800 },
    { name: 'Fri', views: 4900 }, { name: 'Sat', views: 6200 },
    { name: 'Sun', views: 7500 },
];

const ChartSection = () => {
    return (
        <Grid container spacing={3}>
            {/* Main Analytics */}
            <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #f0f0f0', height: '450px' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Weekly Traffic</Typography>
                            <Typography variant="caption" color="textSecondary">Audience engagement analysis</Typography>
                        </Box>
                        <IconButton size="small"><MoreVertIcon /></IconButton>
                    </Stack>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="views" stroke="#1976d2" strokeWidth={4} fill="url(#colorViews)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* Side Progress Section (To fill the gap) */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #f0f0f0', height: '450px', bgcolor: '#1a2027', color: 'white' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Quick Insights</Typography>
                    <Stack spacing={4}>
                        {[
                            { label: 'Avg. Session', value: '4m 32s', progress: 70 },
                            { label: 'Search Traffic', value: '42%', progress: 42 }
                        ].map((item, index) => (
                            <Box key={index}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>{item.label}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                                </Stack>
                                <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                    <Box sx={{ width: `${item.progress}%`, height: '100%', bgcolor: '#1976d2', borderRadius: 3 }} />
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default ChartSection