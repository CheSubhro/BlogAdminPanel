import React from 'react';
import { Paper, Typography, Box, Stack, Alert, AlertTitle, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const alerts = [
    { 
        id: 1, 
        severity: 'warning', 
        title: 'Server Performance', 
        msg: 'Server response time is slightly high (450ms).', 
        time: '5 mins ago' 
    },
    { 
        id: 2, 
        severity: 'success', 
        title: 'Backup Completed', 
        msg: 'Database backup was successful.', 
        time: '1 hour ago' 
    },
    { 
        id: 3, 
        severity: 'info', 
        title: 'New Update', 
        msg: 'Strapi v5.1 is now available for update.', 
        time: 'Yesterday' 
    }
];

const SystemAlerts = () => {
    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #f0f0f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <NotificationsActiveIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>System Alerts</Typography>
                </Stack>
                <Chip label={`${alerts.length} New`} size="small" color="primary" sx={{ fontWeight: 700 }} />
            </Stack>

            <Stack spacing={2}>
                {alerts.map((alert) => (
                    <Alert 
                        key={alert.id} 
                        severity={alert.severity} 
                        variant="outlined"
                        action={
                            <IconButton size="small" color="inherit">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                        sx={{ 
                            borderRadius: 3,
                            borderWidth: '1px',
                            '& .MuiAlert-message': { width: '100%' }
                        }}
                    >
                        <AlertTitle sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                            {alert.title}
                        </AlertTitle>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                            {alert.msg}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6 }}>
                            {alert.time}
                        </Typography>
                    </Alert>
                ))}
            </Stack>
        </Paper>
    )
}

export default SystemAlerts