import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import { 
    Box, TextField, Button, Typography, Paper, Grid, 
    Divider, Stack, IconButton, Tooltip,MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions,Snackbar, Alert 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PreviewIcon from '@mui/icons-material/Preview';


const CreatePost = () => {

    const ejInstance = useRef(null);
    const fileInputRef = useRef(null);

    // States
    const [title, setTitle] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [category, setCategory] = useState('');
    const [slug, setSlug] = useState('');
    const [tags, setTags] = useState('');
    const [dbCategories, setDbCategories] = useState([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' | 'error' | 'info' | 'warning'
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        if (ejInstance.current) return;

        const editor = new EditorJS({
            holder: 'editorjs',
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: ['link'],
                    config: { placeholder: 'Enter a header', levels: [2, 3, 4], defaultLevel: 2 }
                },
                list: { class: List, inlineToolbar: true },
            },
            placeholder: 'Tell your story...',
            onReady: () => { ejInstance.current = editor; },
            autofocus: true,
        });

        return () => {
            if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
                ejInstance.current.destroy();
                ejInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                setDbCategories(res.data);
                
                // Jodi list-e data thake, tobe prothomtar ID set korun
                if (res.data.length > 0) {
                    setCategory(res.data[0]._id); 
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Title change handler
    const handleTitleChange = (e) => {

        const val = e.target.value;
        setTitle(val);
        const generatedSlug = val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with a single dash
            .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
    
        setSlug(generatedSlug);
    };

    // Image change logic
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImage(URL.createObjectURL(file));
        }
    };

    // Preview logic
    const handlePreview = async () => {
        if (ejInstance.current) {
            const savedData = await ejInstance.current.save();
            setPreviewData({ title, content: savedData, image: featuredImage });
            setIsPreviewOpen(true);
        }
    };

    // Render Preview logic 
    const renderPreviewContent = (data) => {
        if (!data || !data.blocks) return null;
    
        return data.blocks.map((block, index) => {
            if (block.type === 'header') {
                return <Typography key={index} variant={`h${block.data.level}`} sx={{ fontWeight: 700, mt: 3, mb: 1 }}>{block.data.text}</Typography>;
            }
            if (block.type === 'list') {
                return (
                    <Box component="ul" key={index} sx={{ pl: 3 }}>
                        {block.data.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
                    </Box>
                );
            }
            // Default paragraph
            return <Typography key={index} variant="body1" sx={{ lineHeight: 1.8, mb: 2 }} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        });
    };

    const user = JSON.parse(localStorage.getItem('userInfo')); 
    const authorId = user?._id;

    // Final Common Save/Publish logic
    const handleSavePost = async (status = 'draft') => {

        if (!title.trim()) {
            alert("Please enter a title first!");
            return;
        }

        if (ejInstance.current) {
            try {
                //  EditorJS data save 
                const savedData = await ejInstance.current.save();
                
                //  FormData Create 
                const formData = new FormData();
                
                formData.append('title', title);
                formData.append('slug', slug);
                formData.append('content', JSON.stringify(savedData)); 
                formData.append('category', category);
                formData.append('tags', tags); 
                formData.append('status', status === 'publish' ? 'Published' : 'Draft');
                
                //  Author ID 
                formData.append('author', authorId);

                
                if (fileInputRef.current.files[0]) {
                    formData.append('image', fileInputRef.current.files[0]);
                } else if (status === 'publish') {
                    setSnackbar({ open: true, message: 'Featured image is required for publishing!', severity: 'error' });
                    return;
                }

                // 4. Axios POST Request
                const response = await axios.post('http://localhost:5000/api/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    }
                });

                if (response.status === 201) {
                    setSnackbar({ 
                        open: true, 
                        message: `Post ${status === 'publish' ? 'Published' : 'Saved as Draft'} successfully!`, 
                        severity: 'success' 
                    });

                    resetForm(); // Form Reset

                    setIsPreviewOpen(false);
                    
                }

            } catch (error) {
                console.error('Axios Error:', error);
                const errorMsg = error.response?.data?.message || "Server error occurred";
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            }
        }
    };

    // Reset form logic
    const resetForm = () => {
        setTitle('');
        setSlug('');
        setTags('');
        setFeaturedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
        
        // EditorJS clear 
        if (ejInstance.current) {
            ejInstance.current.clear();
        }
        if (dbCategories.length > 0) {
            setCategory(dbCategories[0]._id);
        }
    };

    return (
        <Box sx={{ 
            p: { xs: 2, md: 4 }, 
            pl: { md: '40px', lg: '80px' }, // Maintaining the sidebar-push consistency
            maxWidth: '1500px', 
            mx: 'auto' 
        }}>
            {/* Top Action Bar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
                        New Story
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Write and refine your masterpiece</Typography>
                </Box>
                <Stack direction="row" spacing={2}>

                    <Tooltip title="Preview Post">
                        <IconButton onClick={handlePreview} sx={{ border: '1px solid #ddd' }}>
                            <PreviewIcon />
                        </IconButton>
                    </Tooltip>
                    <Button 
                        variant="outlined" 
                        onClick={() => handleSavePost('draft')}
                        sx={{ borderRadius: 2, px: 3, fontWeight: 700, textTransform: 'none' }}
                    >
                        Save Draft
                    </Button>

                    <Button 
                        variant="contained" 
                        onClick={() => handleSavePost('publish')}
                        sx={{ 
                            borderRadius: 2, px: 4, fontWeight: 800, textTransform: 'none',
                            bgcolor: '#1976d2', boxShadow: '0 4px 14px rgba(25,118,210,0.3)'
                        }}
                    >
                        Publish
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={4}>
                {/* Left Side: Main Writing Area */}
                <Grid item xs={12} md={8.5}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 3, md: 7 }, 
                            borderRadius: 6, 
                            border: '1px solid #eee', 
                            minHeight: '800px',
                            bgcolor: 'white',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Title..."
                            variant="standard"
                            value={title}
                            onChange={handleTitleChange} 
                            slotProps={{ 
                                input: { 
                                    disableUnderline: true, 
                                    style: { 
                                        fontSize: 28, 
                                        fontWeight: 500, 
                                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                                        color: '#1a1a1a'
                                    } 
                                } 
                            }}
                            sx={{ mb: 4 }}
                        />
                        
                        {/* Editor Container with better Typography control */}
                        <Box 
                            id="editorjs" 
                            sx={{ 
                                '& .ce-block__content': { maxWidth: '100%', marginLeft: 0 }, 
                                '& .ce-toolbar__content': { maxWidth: '100%', marginLeft: 0 },
                                '& .codex-editor__redactor': { paddingBottom: '50px !important' },
                                '& .ce-header': { fontWeight: 800, letterSpacing: '-0.5px' },
                                '& .ce-paragraph': { fontSize: '1.25rem', lineHeight: '1.8', color: '#333' },
                                fontFamily: '"Inter", sans-serif'
                            }}
                        ></Box>
                    </Paper>
                </Grid>

                {/* Right Side: Sidebar Settings */}
                <Grid item xs={12} md={3.5}>
                    <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
                        {/* Post Settings Card */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #eee' }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <SettingsIcon sx={{ fontSize: 20, color: '#666' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Post Settings</Typography>
                            </Stack>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2.5}>
                                {/* Category Field */}
                                <TextField
                                    select 
                                    label="Category" 
                                    size="small" 
                                    fullWidth 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: '#fcfcfc' } }}
                                >
                                    {/* Dynamic database categories mapping */}
                                    {dbCategories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {/* Slug Field */}
                                <TextField 
                                    fullWidth 
                                    label="Slug" 
                                    size="small" 
                                    value={slug} 
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: '#fcfcfc' } }} 
                                />

                                {/* Tags Field */}
                                <TextField 
                                    fullWidth 
                                    label="Tags" 
                                    size="small" 
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="comma, separated" 
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            bgcolor: '#fcfcfc',
                                            transition: '0.3s',
                                            "&:hover": { bgcolor: '#f5f5f5' },
                                            "& fieldset": { borderColor: '#e0e0e0' }
                                        },
                                        "& .MuiInputLabel-root": { fontSize: '0.9rem' }
                                    }}
                                />
                            </Stack>
                        </Paper>

                        {/* Featured Image Card */}

                        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #eee' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Featured Image</Typography>
    
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                            />

                            <Box 
                                onClick={() => fileInputRef.current.click()} 
                                sx={{ 
                                    width: '100%', height: 220, bgcolor: '#fcfcfc', 
                                    borderRadius: 4, border: '2px dashed #e0e0e0',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    transition: '0.3s',
                                    overflow: 'hidden', 
                                    '&:hover': { bgcolor: '#f5f8ff', borderColor: '#1976d2' },
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                {featuredImage ? (
                                    <img 
                                        src={featuredImage} 
                                        alt="Featured" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    // Default UI
                                    <>
                                        <CloudUploadIcon sx={{ fontSize: 48, color: '#bcc1c8', mb: 1.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#666' }}>Drop image here</Typography>
                                        <Typography variant="caption" color="textSecondary">PNG, JPG up to 10MB</Typography>
                                    </>
                                )}
                            </Box>
                            
                            {/* Remove Image Option */}
                            {featuredImage && (
                                <Button 
                                    fullWidth size="small" color="error" 
                                    onClick={() => setFeaturedImage(null)}
                                    sx={{ mt: 1, textTransform: 'none' }}
                                >
                                    Remove Image
                                </Button>
                            )}
                        </Paper>

                    </Stack>
                </Grid>
            </Grid>

            {/* --- Preview Modal --- */}
            <Dialog 
                fullWidth 
                maxWidth="md" 
                open={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)}
                scroll="body"
                slotProps={{ paper: { sx: { borderRadius: 4, p: { xs: 2, md: 4 } } } }}
            >
                {/* Meta Info (Category & Status) */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Typography 
                    variant="overline" 
                    sx={{ bgcolor: '#e3f2fd', px: 1.5, borderRadius: 1, fontWeight: 700, color: '#1976d2' }}
                >
                    {dbCategories.find(c => c._id === category)?.name || "Uncategorized"}
                </Typography>
                </Stack>

                <DialogTitle sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.5rem' }, p: 0, mb: 2, lineHeight: 1.2 }}>
                    {title || "Untitled Story"}
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    {/* Featured Image */}
                    {featuredImage && (
                        <Box sx={{ width: '100%', maxHeight: 450, mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <img src={featuredImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    )}

                    {/* Dynamic Content Parsing */}
                    <Box sx={{ color: '#333' }}>
                        {previewData ? renderPreviewContent(previewData.content) : "No content available."}
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Tags Display */}
                    {tags && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {tags.split(',').map((tag, i) => (
                                tag.trim() && <Typography key={i} variant="caption" sx={{ border: '1px solid #ddd', px: 2, py: 0.5, borderRadius: 10, bgcolor: '#fafafa' }}>#{tag.trim()}</Typography>
                            ))}
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions sx={{ mt: 4, p: 0 }}>
                    <Button onClick={() => setIsPreviewOpen(false)} variant="outlined" sx={{ borderRadius: 2, px: 4 }}>
                        Back to Editor
                    </Button>
                    <Button onClick={() => handleSavePost('publish')} variant="contained" sx={{ borderRadius: 2, px: 4, bgcolor: '#1976d2' }}>
                        Looks Good, Publish!
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={5000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled" 
                    sx={{ 
                        width: '100%', 
                        fontWeight: 700, 
                        borderRadius: '12px',
                        fontSize: '1rem',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        color: '#fff', 
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default CreatePost;