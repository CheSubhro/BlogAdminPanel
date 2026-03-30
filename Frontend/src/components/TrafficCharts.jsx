// Bar Chart + Pie Chart

import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const barData = [
    { name: 'Jan', views: 4000 }, { name: 'Feb', views: 3000 },
    { name: 'Mar', views: 5000 }, { name: 'Apr', views: 4500 },
    { name: 'May', views: 6000 }, { name: 'Jun', views: 5500 },
];

const pieData = [
    { name: 'Tech', value: 45 }, { name: 'Dev', value: 25 }, { name: 'UI/UX', value: 30 }
];
const COLORS = ['#1976d2', '#2e7d32', '#ed6c02'];

const TrafficCharts = () => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Bar Chart Section */}
            <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', height: '450px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Traffic Flow</Typography>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={barData}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                            <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '10px', border: 'none'}} />
                            <Bar dataKey="views" fill="#1976d2" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* Pie Chart Section */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', height: '450px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Category Share</Typography>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie data={pieData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default TrafficCharts;