import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, Typography, Paper, Stack, Avatar, IconButton, 
    Chip, Divider, Button, Tooltip, Grid, Dialog, DialogTitle, 
    DialogContent, DialogContentText, DialogActions,
    TextField,CircularProgress,Fade 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReplyIcon from '@mui/icons-material/Reply';

const Comments = () => {

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:5000/api/comments';

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // --- Fetch Comments (Get All) ---
    const fetchComments = async () => {
        setLoading(true); 
        try {
            const response = await axios.get(API_URL,config);
            setComments(response.data);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);


    //  --- HANDLERS ---

    // --- Action Handler (Approve or Spam) ---
    const handleAction = async (id, newStatus) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/status`, { status: newStatus },config);
            // local state update
            setComments(comments.map(c => c._id === id ? response.data : c));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    // Delete Confirm logic (State)
    const [open, setOpen] = useState(false); // Dialog open/close control
    const [selectedId, setSelectedId] = useState(null);

    // When Delete icon click dialog open
    const handleClickOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    // Dialog Closed
    const handleClose = () => {
        setOpen(false);
        setSelectedId(null);
    };

    // After Confirmation then delete 
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${selectedId}`,config);
            setComments(comments.filter(c => c._id !== selectedId));
            setOpen(false);
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    // ---  Mark All as Read (Approve All) ---
    const handleMarkAllAsRead = async () => {
        try {
            await axios.put(`${API_URL}/approve-all`,config);
            fetchComments();
        } catch (err) {
            console.error("Error approving all:", err);
        }
    };

    //  Reply logic (State) 
    const [replyingTo, setReplyingTo] = useState(null); 
    const [replyText, setReplyText] = useState('');

    // Reply Logic
    const handleSendReply = async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/reply`, { replyText },config);
            setComments(comments.map(c => c._id === id ? response.data : c));
            setReplyingTo(null);
            setReplyText('');
        } catch (err) {
            console.error("Error sending reply:", err);
        }
    };

    //  Stats Calculation
    const totalComments = comments.length; // Total Comments: All array length
    const pendingCount = comments.filter(c => c.status === 'Pending').length; // Logic to count pending comments
    const spamCount = comments.filter(c => c.status === 'Spam').length; //Spam Blocked

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Comments</Typography>
                    <Typography variant="body2" color="textSecondary">Manage and moderate user interactions</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={handleMarkAllAsRead}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none',
                            fontWeight: 700,
                            borderColor: '#1976d2',
                            '&:hover': { bgcolor: '#f0f7ff' }
                        }}
                    >
                        Mark all as read
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                
                <Grid item xs={12} lg={8}>
                    {/* --- LOADING SPINNER LOGIC --- */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                            <CircularProgress size={40} thickness={5} sx={{ color: '#1976d2', mb: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                                Loading comments...
                            </Typography>
                        </Box>
                    ) : (
                        <Fade in={!loading}>
                            <Stack spacing={2}>
                                {comments.map((comment) => (
                                    <Paper 
                                        key={comment._id} 
                                        elevation={0} 
                                        sx={{ 
                                            p: 3, 
                                            borderRadius: 4, 
                                            border: '1px solid #f0f0f0',
                                            transition: '0.2s',
                                            '&:hover': { borderColor: '#1976d2', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        <Stack direction="row" spacing={2}>
                                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700 }}>
                                                {comment.initials}
                                            </Avatar>
                                            
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{comment.user}</Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            on <strong>{comment.post}</strong> • {comment.date}
                                                        </Typography>
                                                    </Box>
                                                    <Chip 
                                                        label={comment.status} 
                                                        size="small" 
                                                        color={comment.status === 'Approved' ? 'success' : 'warning'}
                                                        sx={{ fontWeight: 700, fontSize: '10px' }}
                                                    />
                                                </Stack>

                                                <Typography variant="body2" sx={{ mt: 1.5, color: '#444', lineHeight: 1.6 }}>
                                                    "{comment.text}"
                                                </Typography>

                                                {comment.adminReply && (
                                                    <Box sx={{ mt: 2, ml: 5, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, borderLeft: '4px solid #1976d2' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#1976d2' }}>Your Reply:</Typography>
                                                        <Typography variant="body2">{comment.adminReply}</Typography>
                                                    </Box>
                                                )}

                                                {replyingTo === comment._id && (
                                                    <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #1976d2' }}>
                                                        <Box 
                                                            component="textarea"
                                                            placeholder="Write your response..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '12px',
                                                                borderRadius: '12px',
                                                                border: '1px solid #eee',
                                                                backgroundColor: '#fafafa',
                                                                fontFamily: 'inherit',
                                                                fontSize: '0.9rem',
                                                                outline: 'none',
                                                                resize: 'none',
                                                                minHeight: '80px'
                                                            }}
                                                        />
                                                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                                                            <Button 
                                                                size="small" 
                                                                onClick={() => setReplyingTo(null)}
                                                                sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button 
                                                                size="small" 
                                                                variant="contained" 
                                                                onClick={() => handleSendReply(comment._id)}
                                                                disabled={!replyText.trim()}
                                                                sx={{ 
                                                                    textTransform: 'none', 
                                                                    borderRadius: '8px', 
                                                                    fontSize: '12px',
                                                                    boxShadow: 'none',
                                                                    bgcolor: '#1976d2'
                                                                }}
                                                            >
                                                                Post Reply
                                                            </Button>
                                                        </Stack>
                                                    </Box>
                                                )}

                                                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                                                <Stack direction="row" spacing={1}>
                                                    <Button 
                                                        startIcon={<CheckCircleOutlineIcon />} 
                                                        size="small" 
                                                        onClick={() => handleAction(comment._id, 'Approved')}
                                                        disabled={comment.status === 'Approved'}
                                                        sx={{ textTransform: 'none', fontWeight: 700 }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button 
                                                        startIcon={<ReplyIcon />} 
                                                        size="small" 
                                                        color="inherit"
                                                        onClick={() => setReplyingTo(comment._id)}
                                                        sx={{ textTransform: 'none', fontWeight: 700 }}
                                                    >
                                                        Reply
                                                    </Button>
                                                    <Box sx={{ flexGrow: 1 }} />

                                                    <Tooltip title="Mark as Spam">
                                                        <IconButton 
                                                            size="small" color="warning"
                                                            onClick={() => handleAction(comment._id, 'Spam')}
                                                            disabled={comment.status === 'Spam'}
                                                        >
                                                            <ErrorOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Delete">
                                                        <IconButton 
                                                            size="small" color="error"
                                                            onClick={() => handleClickOpen(comment._id)} 
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                                
                                {comments.length === 0 && (
                                    <Typography align="center" color="textSecondary" sx={{ py: 5 }}>
                                        No comments found.
                                    </Typography>
                                )}
                            </Stack>
                        </Fade>
                    )}
                </Grid>

                {/* Right Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Moderation Stats</Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">Total Comments</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800 }}>{totalComments}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">Pending Approval</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#ed6c02' }}>{pendingCount}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">Spam Blocked</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#d32f2f' }}>{spamCount}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

            </Grid>

            {/* --- Delete Confirmation Dialog --- */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ borderRadius: 2, textTransform: 'none' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}

export default Comments