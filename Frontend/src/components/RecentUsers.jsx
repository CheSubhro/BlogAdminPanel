import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Paper, Box, Typography, List, ListItem, 
    ListItemAvatar, Avatar, ListItemText, Divider, Button, Skeleton 
} from '@mui/material';

// For Avatar random color generate function
const getRandomColor = (name) => {
    const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#ed6c02', '#9c27b0', '#009688'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

const RecentUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/users?limit=5'); 
                
                const processedUsers = data.map(user => ({
                    id: user.id, 
                    name: user.name,
                    role: user.role || 'User',
                    initial: user.img, 
                    color: getRandomColor(user.name),
                    time: new Date(user.createdAt).toLocaleDateString() 
                }));
    
                setUsers(processedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecentUsers();
    }, []);

    return (
        <Paper 
            elevation={0} 
            sx={{ p: 3, borderRadius: '16px', border: '1px solid #eff2f5', bgcolor: '#ffffff', height: '400px', display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a2035' }}>Recent Users</Typography>
                    <Typography variant="caption" color="textSecondary">Latest registrations</Typography>
                </Box>
                <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>View All</Button>
            </Box>

            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {loading ? (
                    [1, 2, 3, 4, 5].map((item) => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                            <Box sx={{ width: '100%' }}>
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                            </Box>
                        </Box>
                    ))
                ) : (
                    users.map((user, index) => (
                        <React.Fragment key={user.id}>
                            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: user.color, fontWeight: 700, fontSize: '14px' }}>
                                        {user.initial}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a2035' }}>{user.name}</Typography>}
                                    secondary={
                                        <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                            <Typography variant="caption" color="textSecondary">{user.role}</Typography>
                                            <Typography variant="caption" sx={{ color: '#9097a7', fontStyle: 'italic' }}>{user.time}</Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index !== users.length - 1 && <Divider variant="inset" component="li" sx={{ ml: '56px', borderColor: '#f8f9fa' }} />}
                        </React.Fragment>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default RecentUsers;