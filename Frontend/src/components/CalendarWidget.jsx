import React from 'react';
import { Paper, Typography, Box, Grid, IconButton, Stack } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const CalendarWidget = () => {

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    // Demo dates for the month
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>March 2026</Typography>
                <Stack direction="row">
                    <IconButton size="small"><ChevronLeftIcon /></IconButton>
                    <IconButton size="small"><ChevronRightIcon /></IconButton>
                </Stack>
            </Stack>

            {/* Days Header */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
                {days.map((day) => (
                    <Grid item xs={1.7} key={day}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', textAlign: 'center' }}>
                            {day}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Dates Grid */}
            <Grid container spacing={1}>
                {/* Initial empty spaces (example: if month starts on Sunday) */}
                {dates.map((date) => (
                    <Grid item xs={1.7} key={date}>
                        <Box 
                            sx={{ 
                                height: 35, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderRadius: 2,
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: date === 5 ? 800 : 500, // Today is 5th
                                bgcolor: date === 5 ? '#1976d2' : 'transparent',
                                color: date === 5 ? 'white' : 'inherit',
                                '&:hover': { bgcolor: date === 5 ? '#1565c0' : '#f5f5f5' }
                            }}
                        >
                            {date}
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Upcoming Event Preview */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 3, borderLeft: '4px solid #1976d2' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#1976d2', display: 'block' }}>
                    UPCOMING EVENT
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Blog Review Meeting
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    10:30 AM - 11:30 AM
                </Typography>
            </Box>
        </Paper>
    )
}

export default CalendarWidget