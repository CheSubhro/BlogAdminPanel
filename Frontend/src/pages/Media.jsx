// src/pages/Media.jsx
import React,{ useState, useRef ,useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, ImageList, ImageListItem, Paper, 
         Button, Stack, IconButton, Dialog,DialogTitle,
         DialogContent,DialogContentText,DialogActions } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


const Media = () => {

    // 1. Initial State  & Refs
    const [images, setImages] = useState([]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const fileInputRef = useRef(null);

    // 2. Upload Handler 
    const handleUploadClick = () => {
        fileInputRef.current.click(); 
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                const res = await axios.post('http://localhost:5000/api/media', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                
                const newUploadedImage = {
                    _id: res.data._id, // ID from Database
                    img: res.data.img || res.data.url, // Cloudinary URL
                    title: res.data.title || file.names 
                };
                setImages(prev => [newUploadedImage, ...prev]);
            } catch (err) {
                console.error("Upload failed for:", file.name);
            }
        }
        event.target.value = null; 
    };

    // 3. Delete Window Logic
    const handleDeleteTrigger = (index) => {
        setSelectedIndex(index);
        setIsDeleteDialogOpen(true); // Open Modal  
    };

    const handleConfirmDelete = async () => {
        if (selectedIndex !== null) {
            const imageToDelete = images[selectedIndex];
            
            try {
                await axios.delete(`http://localhost:5000/api/media/${imageToDelete._id}`);
                
                // UI state update
                setImages(images.filter((_, i) => i !== selectedIndex));
                setIsDeleteDialogOpen(false);
                setSelectedIndex(null);
            } catch (err) {
                console.error("Delete failed");
                alert("Could not delete from database");
            }
        }
    };

    const handleCloseDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedIndex(null);
    };

    useEffect(() => {
        const fetchMedia = async () => {
            const res = await axios.get('http://localhost:5000/api/media');
            setImages(res.data); 
        };
        fetchMedia();
    }, []);

    //  Render Component
    return (
        <Box>
            {/* Hidden Input for Files */}

            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Media Library</Typography>
                    <Typography variant="body2" color="textSecondary">Manage your assets and uploads</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUploadClick}
                    sx={{ 
                        borderRadius: 3, 
                        textTransform: 'none', 
                        fontWeight: 700, 
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' }
                    }}
                >
                    Upload New
                </Button>
            </Stack>

            {/* Gallery Section */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 5, border: '1px solid #f0f0f0' }}>
                {images.length > 0 ? (
                    <ImageList 
                        sx={{ width: '100%', height: 'auto', m: 0 }} 
                        cols={4} 
                        gap={16}
                    >
                        {images.map((item, index) => (
                            <ImageListItem 
                                key={item._id || index} 
                                sx={{ 
                                    borderRadius: 4, 
                                    overflow: 'hidden',
                                    border: '1px solid #f0f0f0',
                                    position: 'relative',
                                    '&:hover .delete-btn': { opacity: 1 }, 
                                }}
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                
                                {/* Hover Actions */}
                                <Box 
                                    className="delete-btn"
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 8, 
                                        right: 8, 
                                        opacity: 0, 
                                        transition: '0.2s',
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: 2
                                    }}
                                >
                                    <IconButton 
                                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#ffebee', color: '#d32f2f' } }} 
                                        onClick={() => handleDeleteTrigger(index)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <Box sx={{ p: 10, textAlign: 'center' }}>
                        <Typography color="textSecondary">No media found. Upload some images!</Typography>
                    </Box>
                )}
            </Paper>

            {/* --- Delete Confirmation Window --- */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleCloseDialog}
                slotProps={{ 
                    paper: { 
                        sx: { borderRadius: 4, width: '100%', maxWidth: '350px', p: 1 } 
                    } 
                }}
            >
                <Box sx={{ textAlign: 'center', p: 2 }}>
                    <WarningAmberIcon sx={{ color: '#ed6c02', fontSize: 50, mb: 1 }} />
                    <DialogTitle sx={{ fontWeight: 800, p: 0, mb: 1 }}>Remove Image?</DialogTitle>
                    <DialogContent sx={{ p: 0, mb: 3 }}>
                        <DialogContentText sx={{ fontSize: '14px' }}>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 0 }}>
                        <Button 
                            onClick={handleCloseDialog} 
                            variant="outlined" 
                            sx={{ borderRadius: 2, flex: 1, textTransform: 'none', color: 'text.primary', borderColor: '#e0e0e0' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmDelete} 
                            variant="contained" 
                            color="error" 
                            sx={{ borderRadius: 2, flex: 1, textTransform: 'none', boxShadow: 'none' }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </Box>
    );
}

export default Media;