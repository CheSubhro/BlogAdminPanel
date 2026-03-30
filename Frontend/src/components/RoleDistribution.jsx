import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Paper, Box, Typography, Skeleton 
} from '@mui/material';
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const RoleDistribution = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoleData = async () => {
            try {
                setLoading(true);
                const { data: responseData } = await axios.get('http://localhost:5000/api/users/roles/distribution');
                setData(responseData);
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoleData();
    }, []);

    // Total user count calculate 
    const totalUsers = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
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
            {/* Header Section */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a2035' }}>
                    Role Distribution
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Breakdown of user access levels from database
                </Typography>
            </Box>

            {/* Chart Section */}
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                    <Skeleton variant="circular" width={180} height={180} />
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                }} 
                            />
                            
                            <Legend 
                                verticalAlign="bottom" 
                                align="center"
                                iconType="circle"
                                formatter={(value) => (
                                    <span style={{ color: '#444', fontWeight: 600, fontSize: '12px' }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography color="textSecondary">No data available</Typography>
                )}
            </Box>

            {/* Total Count Display */}
            <Box sx={{ textAlign: 'center', mt: 1 }}>
                {loading ? (
                    <Skeleton width={100} sx={{ mx: 'auto' }} />
                ) : (
                    <Typography variant="caption" sx={{ color: '#9097a7', fontWeight: 600 }}>
                        TOTAL USERS: {totalUsers}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default RoleDistribution;