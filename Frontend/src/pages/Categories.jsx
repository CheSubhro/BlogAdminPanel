import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { 
    Box, Grid, TextField, Button, Paper, Typography, Table, 
    TableBody, TableCell, TableHead, TableRow, IconButton, 
    Stack, Chip, Divider, List, ListItem, ListItemText, Dialog,Snackbar, Alert, Slide
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';

const Categories = () => {

    // 1. Initial State
    const [categories, setCategories] = useState([]); // Initial empty array
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
    const [editingId, setEditingId] = useState(null); 

    // Delete Modal States
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Toast message
    const [notification, setNotification] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' // 'success', 'error', 'info', 'warning'
    });

    // Helper to get token for protected routes
    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // 2. Logic Handlers

    //  Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Auto-generate slug from name (only when creating new)
        if (name === 'name' && !editingId) {
            setFormData(prev => ({ 
                ...prev, 
                name: value, 
                slug: value.toLowerCase().replace(/\s+/g, '-') 
            }));
        }
    };

    // Edit Trigger 
    const handleEditTrigger = (cat) => {
        setEditingId(cat._id);
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel Edit Mode
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', slug: '', description: '' });
    };

    // Main Submit Logic (Create + Update )
    const handleSubmit = async () => {
        if (!formData.name || !formData.slug) return alert("Please fill Name and Slug!");

        try {

            if (editingId) {
                // Update Existing Category (PUT)
                const res = await axios.put(`http://localhost:5000/api/categories/${editingId}`, formData,getAuthHeaders());
                setCategories(categories.map(cat => cat._id === editingId ? res.data : cat));
                setEditingId(null);
                // Success Message for Update
                setNotification({ 
                    open: true, 
                    message: 'Category Updated Successfully!', 
                    severity: 'success' 
                });
            } else {
                // Create New Category (POST)
                const res = await axios.post('http://localhost:5000/api/categories', formData,getAuthHeaders());
                setCategories([res.data, ...categories]);
                // Success Message for Create
                setNotification({ 
                    open: true, 
                    message: 'New Category Created!', 
                    severity: 'success' 
                });
            }
    
            setFormData({ name: '', slug: '', description: '' }); // Form Reset
            
        } catch (error) {
            
            // Error Message
            setNotification({ 
                open: true, 
                message: error.response?.data?.message || "Operation failed", 
                severity: 'error' 
            });
        }
    };

    // Notification Close
    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification({ ...notification, open: false });
    };

    // Open Delete Confirmation
    const openDeleteConfirm = (id) => {
        setCategoryToDelete(id);
        setDeleteDialogOpen(true);
    };
    
    // 3. Delete Action
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${categoryToDelete}`,getAuthHeaders());
            setCategories(categories.filter(cat => cat._id !== categoryToDelete));
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            // Error Message
            setNotification({ 
                open: true, 
                message: error.response?.data?.message || "Operation failed", 
                severity: 'error' 
            });
        }
    };
    //  Fetch Categories on Load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    // 3. Render Component

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Category Management</Typography>
            <Grid container spacing={3} alignItems="stretch">

                {/* --- Left Column: Add/Edit Form --- */}
                <Grid item xs={12} lg={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0', height: '100%', position: 'relative' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {editingId ? "Edit Category" : "Add New"}
                            </Typography>
                            {editingId && (
                                <IconButton size="small" onClick={cancelEdit}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Stack>

                        <Stack spacing={3}>
                            <TextField 
                                fullWidth label="Category Name" size="small" name="name"
                                value={formData.name} onChange={handleChange}
                            />
                            <TextField 
                                fullWidth label="Slug" size="small" name="slug"
                                value={formData.slug} onChange={handleChange} helperText="URL-friendly identifier"
                            />
                            <TextField 
                                fullWidth label="Description" size="small" name="description"
                                value={formData.description} onChange={handleChange}
                                multiline rows={3} 
                            />
                            <Button 
                                onClick={handleSubmit}
                                variant="contained" fullWidth 
                                color={editingId ? "secondary" : "primary"}
                                sx={{ borderRadius: 2, py: 1.2, fontWeight: 800, textTransform: 'none', boxShadow: 'none' }}
                            >
                                {editingId ? "Update Category" : "Create Category"}
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* --- Middle Column: Category Table --- */}
                <Grid item xs={12} lg={6}>
                    <Paper elevation={0} sx={{ borderRadius: 5, border: '1px solid #f0f0f0', height: '100%', overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                All Categories ({categories.length})
                            </Typography>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Posts</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat._id} hover sx={{ bgcolor: editingId === cat._id ? '#f5faff' : 'inherit' }}>
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cat.color }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{cat.name}</Typography>
                                                    <Typography variant="caption" color="textSecondary">/{cat.slug}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={`${cat.count} posts`} size="small" sx={{ fontWeight: 700, fontSize: '11px' }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleEditTrigger(cat)} color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => openDeleteConfirm(cat._id)} size="small" color="error">
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                {/* --- Right Column: Stats & Guide --- */}
                <Grid item xs={12} lg={3}>
                    <Stack spacing={3} sx={{ height: '100%' }}>

                        {/* Stats Card */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0', bgcolor: '#f0f7ff' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <BarChartIcon sx={{ color: '#1976d2' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1976d2' }}>Global Reach</Typography>
                            </Stack>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1976d2' }}>
                                {categories.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0)}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Total Combined Posts</Typography>
                        </Paper>

                        {/* Quick Guide Card */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0', flexGrow: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <InfoOutlinedIcon color="action" fontSize="small" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Quick Guide</Typography>
                            </Stack>
                            <Divider sx={{ mb: 2 }} />
                            <List disablePadding>
                                <ListItem disablePadding sx={{ mb: 1.5 }}>
                                    <ListItemText 
                                        primary="Hierarchical slugs" 
                                        secondary="Slugs should be unique and lowercase." 
                                        slotProps={{
                                            primary: { sx: { fontSize: '12px', fontWeight: 800 } },
                                            secondary: { sx: { fontSize: '11px' } }
                                        }}
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText 
                                        primary="Bulk Actions" 
                                        secondary="You can merge categories from the main settings." 
                                        slotProps={{
                                            primary: { sx: { fontSize: '12px', fontWeight: 800 } },
                                            secondary: { sx: { fontSize: '11px' } }
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Stack>
                </Grid>

            </Grid>
            
            {/* --- Delete Confirmation Dialog --- */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)}
                slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
            >
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <DeleteOutlineIcon sx={{ fontSize: 50, color: '#ff1744', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Are you sure?</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        This action cannot be undone. This category will be permanently removed.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button 
                            onClick={() => setDeleteDialogOpen(false)} 
                            variant="outlined" 
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmDelete} 
                            variant="contained" 
                            color="error" 
                            sx={{ borderRadius: 2, px: 3, boxShadow: 'none' }}
                        >
                            Yes, Delete
                        </Button>
                    </Stack>
                </Box>
            </Dialog>

            <Snackbar 
                open={notification.open} 
                autoHideDuration={4000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
                TransitionComponent={(props) => <Slide {...props} direction="left" />} // Slide animation
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity} 
                    variant="filled" 
                    sx={{ 
                        width: '100%', 
                        borderRadius: '15px', 
                        fontWeight: 700,
                        fontSize: '14px',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.15)', 
                        padding: '10px 20px',
                        backgroundColor: notification.severity === 'success' ? '#2e7d32' : '#d32f2f',
                        color: '#fff'
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default Categories;