import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import {
    Box, Typography, Paper, Stack, Avatar, IconButton,
    Chip, Button, Grid, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, InputAdornment, Tooltip,
    Dialog, DialogActions, DialogContent, DialogTitle, MenuItem,
    DialogContentText, TableContainer, CircularProgress,Snackbar, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';



const Users = () => {

    // 1. Original Data
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const showToast = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // 2. Search State
    const [searchTerm, setSearchTerm] = useState('');

    //  Fetch Users (GET API)
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 3. Filter Logic for Search (Search with Name or Email)
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 4.Invite New User (Modal State)
    const [inviteOpen, setInviteOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Author' });

    // Handle Invite Form Input
    const handleInviteChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Logic to Add New User to List
    const handleSendInvite = async () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!newUser.name.trim()) {
            showToast("Please enter a valid name", "error");
            return;
        }
        if (!emailRegex.test(newUser.email)) {
            showToast("Please enter a valid email address", "error");
            return;
        }

        try {
            const res = await api.post('/users', newUser);
            setUsers([res.data, ...users]);
            setInviteOpen(false);
            setNewUser({ name: '', email: '', role: 'Author' });
            showToast("Invitation sent successfully!");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to add user", "error");
        }
    };

    // 5. Edit User 
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleEditClick = (user) => {
        setEditingUser({ ...user }); 
        setEditOpen(true);
    };
    
    const handleSaveEdit = async () => {
        try {
            const res = await api.put(`/users/${editingUser.id}`, {
                name: editingUser.name,
                role: editingUser.role,
                status: editingUser.status
            });

            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...res.data } : u));
            setEditOpen(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Update Error:", error);
            alert("Update failed!");
        }
    };

    // 6. Send Mail

    const [mailOpen, setMailOpen] = useState(false);
    const [mailData, setMailData] = useState({ to: '', subject: '', message: '' });

    const handleMailClick = (user) => {
        setMailData({ ...mailData, to: user.email });
        setMailOpen(true);
    };

    const handleSendMail = async () => {
        try {
            const res = await api.post('/users/send-mail', mailData);
            showToast(res.data.message || "Email sent!"); // Alert-er bodole
            setMailOpen(false);
            setMailData({ to: '', subject: '', message: '' });
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to send email", "error");
        }
    };


    // 7. Delete 
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleClickOpen = (id) => {
        setSelectedUserId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUserId(null);
    };
    const confirmDelete = async () => {
        if (selectedUserId) {
            try {
                await api.delete(`/users/${selectedUserId}`);
                setUsers(users.filter(user => user.id !== selectedUserId)); // Remove from UI
                handleClose();
            } catch (error) {
                console.error("Delete Error:", error);
                alert("Could not delete user.");
            }
        }
    };

    // 8. Coloring Role  
    const getRoleColor = (role) => {
        switch (role) {
            case 'Administrator': return 'success';
            case 'Editor': return 'primary';
            case 'Author': return 'warning';
            case 'Contributor': return 'info';
            default: return 'error';
        }
    };


    return (
        <Box sx={{ 
            p: { xs: 2, md: 4 }, 
            pl: { md: '40px', lg: '80px' }, 
            maxWidth: '1600px', 
            mx: 'auto' 
        }}>
            {/* Header Section */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 5 }} spacing={2}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-1.5px' }}>User Management</Typography>
                    <Typography variant="subtitle1" color="textSecondary" >
                        Manage your team and control their access levels.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<PersonAddIcon />} 
                    onClick={() => setInviteOpen(true)} // Open Invite Modal
                    sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none' }}
                >
                    Invite New User
                </Button>
            </Stack>

            {/* --- INVITE USER MODAL --- */}
            <Dialog 
                open={inviteOpen} 
                onClose={() => setInviteOpen(false)}
                slotProps={{
                    paper: {
                        sx: { 
                            borderRadius: 6, 
                            p: 1, 
                            width: '100%', 
                            maxWidth: '460px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            backgroundImage: 'none' 
                        } 
                    }
                }}
            >
                {/* Header with Background Color */}
                <Box sx={{ p: 3, bgcolor: '#f0f7ff', borderBottom: '1px solid #e3f2fd' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1976d2' }}>
                        Invite Member
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Enter details to add a new person to your team.
                    </Typography>
                </Box>

                <DialogContent sx={{ mt: 2 }}>
                    <Stack spacing={2.5}>
                        {/* Name Input */}
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, ml: 1, mb: 0.5, display: 'block', color: '#666' }}>FULL NAME</Typography>
                            <TextField 
                                name="name"
                                fullWidth 
                                value={newUser.name}
                                onChange={handleInviteChange}
                                placeholder="Enter name..."
                                slotProps={{
                                    input: {
                                        sx: { borderRadius: 3, bgcolor: '#f8f9fa' }
                                    }
                                }}
                            />
                        </Box>

                        {/* Email Input */}
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, ml: 1, mb: 0.5, display: 'block', color: '#666' }}>EMAIL ADDRESS</Typography>
                            <TextField 
                                name="email"
                                fullWidth 
                                value={newUser.email}
                                onChange={handleInviteChange}
                                placeholder="name@company.com"
                                slotProps={{
                                    input: {
                                        sx: { borderRadius: 3, bgcolor: '#f8f9fa' }
                                    }
                                }}
                            />
                        </Box>

                        {/* Role Selection */}
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, ml: 1, mb: 0.5, display: 'block', color: '#666' }}>ASSIGN ROLE</Typography>
                            <TextField 
                                name="role"
                                select 
                                fullWidth 
                                value={newUser.role}
                                onChange={handleInviteChange}
                                slotProps={{
                                    input: {
                                        sx: { borderRadius: 3, bgcolor: '#f8f9fa' }
                                    }
                                }}
                            >
                                <MenuItem value="Administrator" sx={{ fontWeight: 600 }}>Administrator</MenuItem>
                                <MenuItem value="Editor" sx={{ fontWeight: 600 }}>Editor</MenuItem>
                                <MenuItem value="Author" sx={{ fontWeight: 600 }}>Author</MenuItem>
                                <MenuItem value="Contributor" sx={{ fontWeight: 600 }}>Contributor</MenuItem>
                            </TextField>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={() => setInviteOpen(false)} 
                        sx={{ 
                            color: '#666', 
                            fontWeight: 800, 
                            textTransform: 'none', 
                            borderRadius: 3,
                            px: 3
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSendInvite} 
                        variant="contained" 
                        disabled={!newUser.name || !newUser.email}
                        sx={{ 
                            borderRadius: 3, 
                            px: 4, 
                            py: 1.2,
                            fontWeight: 800, 
                            textTransform: 'none',
                            boxShadow: '0 8px 16px rgba(25, 118, 210, 0.24)',
                            '&:hover': { boxShadow: '0 12px 20px rgba(25, 118, 210, 0.3)' }
                        }}
                    >
                        Send Invitation
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Search Bar Logic */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid #eff2f5', bgcolor: '#ffffff' }}>
                <TextField 
                    fullWidth
                    placeholder="Search by name, email or role..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9097a7' }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '10px', bgcolor: '#f8f9fa', border: 'none' }
                        }
                    }}
                />
            </Paper>

            {/* Table Section */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eff2f5', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#7b809a', fontSize: '0.85rem', textTransform: 'uppercase' }}>User Info</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#7b809a', fontSize: '0.85rem', textTransform: 'uppercase' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#7b809a', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#7b809a', fontSize: '0.85rem', textTransform: 'uppercase' }}>Engagement</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#7b809a', fontSize: '0.85rem', textTransform: 'uppercase', pr: 4 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={40} />
                                </TableCell>
                            </TableRow>
                        ) :
                        filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ 
                                                bgcolor: '#e3f2fd', 
                                                color: '#1976d2', 
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                width: 42, height: 42,
                                                borderRadius: '12px'
                                            }}>
                                                {user.img ? user.img : user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#344767' }}>{user.name}</Typography>
                                                <Typography variant="caption" sx={{ color: '#7b809a' }}>{user.email}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.role} 
                                            size="small" 
                                            color={getRoleColor(user.role)} 
                                            sx={{ fontWeight: 700, borderRadius: '6px', fontSize: '11px' }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ 
                                            display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: '8px',
                                            bgcolor: user.status === 'Active' ? '#def7ec' : '#fde8e8',
                                            color: user.status === 'Active' ? '#03543f' : '#9b1c1c'
                                        }}>
                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', mr: 1 }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>{user.status}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#344767' }}>{user.posts} <Typography component="span" variant="caption" color="textSecondary">posts</Typography></Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Message">
                                                <IconButton onClick={() => handleMailClick(user)} sx={{ color: '#1976d2', bgcolor: '#f0f7ff', '&:hover': { bgcolor: '#e3f2fd' } }}>
                                                    <MailOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleEditClick(user)} sx={{ color: '#2e7d32', bgcolor: '#e8f5e9', '&:hover': { bgcolor: '#d4edda' } }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleClickOpen(user.id)} sx={{ color: '#d32f2f', bgcolor: '#ffebee', '&:hover': { bgcolor: '#f8d7da' } }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="textSecondary">No team members found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}                    
                    </TableBody>
                </Table>
            </TableContainer>
        

            {/* --- MODERN EDIT USER MODAL --- */}
            <Dialog 
                open={editOpen} 
                onClose={() => setEditOpen(false)}
                slotProps={{ 
                    paper: { 
                        sx: { borderRadius: 6, p: 1, width: '100%', maxWidth: '460px' } 
                    } 
                }}

                
            >
                <Box sx={{ p: 3, bgcolor: '#f0f7ff', borderBottom: '1px solid #e3f2fd' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1976d2' }}>Edit Member</Typography>
                    <Typography variant="body2" color="textSecondary">Modify user role and information.</Typography>
                </Box>

                <DialogContent sx={{ mt: 2 }}>
                    {editingUser && (
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, ml: 1, mb: 0.5, display: 'block' }}>FULL NAME</Typography>
                                <TextField 
                                    fullWidth 
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: '#f8f9fa' } } }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, ml: 1, mb: 0.5, display: 'block' }}>ROLE</Typography>
                                <TextField 
                                    select fullWidth 
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                    slotProps={{ input: { sx: { borderRadius: 3, bgcolor: '#f8f9fa' } } }}
                                >
                                    <MenuItem value="Administrator">Administrator</MenuItem>
                                    <MenuItem value="Editor">Editor</MenuItem>
                                    <MenuItem value="Author">Author</MenuItem>
                                    <MenuItem value="Contributor">Contributor</MenuItem>
                                </TextField>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ color: '#666', fontWeight: 800 }}>Cancel</Button>
                    <Button 
                        onClick={handleSaveEdit} 
                        variant="contained" 
                        sx={{ borderRadius: 3, px: 4, fontWeight: 800, textTransform: 'none' }}
                    >
                        Update User
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- MODERN SEND MAIL MODAL --- */}
            <Dialog 
                open={mailOpen} 
                onClose={() => setMailOpen(false)}
                slotProps={{ paper: { sx: { borderRadius: 6, p: 1, width: '100%', maxWidth: '500px' } } }}
            >
                <Box sx={{ p: 3, bgcolor: '#f0f7ff', borderBottom: '1px solid #e3f2fd' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1976d2' }}>Send Message</Typography>
                    <Typography variant="body2" color="textSecondary">Direct communication with your team member.</Typography>
                </Box>

                <DialogContent sx={{ mt: 2 }}>
                    <Stack spacing={2.5}>
                        <TextField 
                            label="To" fullWidth disabled 
                            value={mailData.to} 
                            slotProps={{ input: { sx: { borderRadius: 3, bgcolor: '#f8f9fa' } } }}
                        />
                        <TextField 
                            label="Subject" fullWidth 
                            placeholder="What is this about?"
                            value={mailData.subject}
                            onChange={(e) => setMailData({...mailData, subject: e.target.value})}
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField 
                            label="Message" fullWidth multiline rows={4} 
                            placeholder="Write your message here..."
                            value={mailData.message}
                            onChange={(e) => setMailData({...mailData, message: e.target.value})}
                            slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setMailOpen(false)} sx={{ color: '#666', fontWeight: 800 }}>Cancel</Button>
                    <Button 
                        onClick={handleSendMail} 
                        variant="contained" 
                        sx={{ borderRadius: 3, px: 4, fontWeight: 800, textTransform: 'none', bgcolor: '#1976d2' }}
                    >
                        Send Email
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- CONFIRMATION DIALOG --- */}
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{ 
                    paper: { 
                        sx: { borderRadius: 4, p: 1, maxWidth: '400px' } 
                    } 
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
                    <WarningAmberIcon color="error" /> Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 500, color: '#555' }}>
                        Are you sure you want to remove this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: '#666', borderColor: '#ddd' }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} variant="contained" color="error" autoFocus sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}>
                        Yes, Delete User
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    )
}

export default Users;