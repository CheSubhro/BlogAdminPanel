
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Box, Typography, Stack, Skeleton } from '@mui/material';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';


const UserGrowthChart = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrowthData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/analytics/charts');
                
                /* Backend response format: [{ day: 'Sun', posts: 5 }, { day: 'Mon', posts: 12 }]
                */
                setData(response.data);
            } catch (error) {
                console.error("Error fetching growth data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrowthData();
    }, []);

    return (
        <>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    border: '1px solid #eff2f5', 
                    bgcolor: '#ffffff',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a2035' }}>
                            Post Activity
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Last 7 days performance
                        </Typography>
                    </Box>
                    
                    {!loading && data.length > 0 && (
                        <Box sx={{ bgcolor: '#f0f7ff', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1976d2' }}>
                                Live Updates
                            </Typography>
                        </Box>
                    )}
                </Stack>

                <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                
                                <XAxis 
                                    dataKey="day" // Backend returns 'day'
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9097a7', fontSize: 12 }} 
                                    dy={10}
                                />
                                
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9097a7', fontSize: 12 }} 
                                />
                                
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                    }} 
                                />
                                
                                <Area 
                                    type="monotone" 
                                    dataKey="posts" // Backend returns 'posts'
                                    stroke="#1976d2" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorPosts)" 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Box>
            </Paper>
        </>
    )
}

export default UserGrowthChart