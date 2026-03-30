
// src/components/QuickActions.jsx

import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Added 'path' for each action
const actions = [
    { label: 'New Post', icon: <AddIcon sx={{ fontSize: 20 }} />, color: '#1976d2', desc: 'Write fresh blog', path: '/create-post' },
    { label: 'Upload Media', icon: <CloudUploadIcon sx={{ fontSize: 20 }} />, color: '#2e7d32', desc: 'Manage gallery', path: '/media' },
    { label: 'Add User', icon: <PersonAddIcon sx={{ fontSize: 20 }} />, color: '#ed6c02', desc: 'Invite teammates', path: '/users' },
    { label: 'Site Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} />, color: '#455a64', desc: 'Configure system', path: '/settings' },
];

const QuickActions = () => {
    return (
        <>
            <Box sx={{ width: '100%', mt: -10 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}> 
                    {actions.map((action, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper 
                                component={Link} // 3. Make the Paper act as a Link
                                to={action.path} // 4. Set the destination
                                elevation={0} 
                                sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    border: '1px solid #f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    textDecoration: 'none', // Remove default link underline
                                    '&:hover': { 
                                        bgcolor: '#fafafa',
                                        borderColor: action.color,
                                        boxShadow: `0 4px 12px ${action.color}10`,
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    p: 1, 
                                    borderRadius: 2, 
                                    bgcolor: `${action.color}10`, 
                                    color: action.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {action.icon}
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#1a2027', fontSize: '0.9rem' }}>
                                        {action.label}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
                                        {action.desc}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default QuickActions;