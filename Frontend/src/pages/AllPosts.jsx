import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Box, Typography, Paper, Button, IconButton, Chip, 
    TextField, InputAdornment, Stack, Dialog,DialogContentText,
    Menu, MenuItem, AppBar, Toolbar,Autocomplete,
    Slide, Container 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

// Modal Transition effect 
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AllPosts = () => {

    const navigate = useNavigate();

    // 1. States
    const [rows, setRows] = useState([]); // Empty array for data from Database

    const [searchText, setSearchText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    // Delete Modal States
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null); // Filter menu control
    const [statusFilter, setStatusFilter] = useState('All'); // Filter state

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);

    // --- FETCH POSTS FROM BACKEND ---
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const [postsRes, catsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/posts'),
                    axios.get('http://localhost:5000/api/categories') 
                ]);
                setRows(postsRes.data);
                setCategories(catsRes.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false); 
            }
        };
        fetchPosts();
    }, []);


    // 2. Search Logic (Title, Author, Category) + Filter Logic
    const filteredRows = rows.filter((row) => {
        const searchLower = searchText.toLowerCase();
        const categoryName = row.category?.name || '';
        const authorName = row.author?.name || '';
        const title = row.title || '';
    
        const matchesSearch = 
            title.toLowerCase().includes(searchLower) ||
            authorName.toLowerCase().includes(searchLower) ||
            categoryName.toLowerCase().includes(searchLower);
        
        const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 3. Handlers

    // Filter Logic
    const handleFilterClick = (event) => setAnchorEl(event.currentTarget);

    const handleFilterClose = (status) => {
        if (status) setStatusFilter(status);
        setAnchorEl(null);
    };

    // Delete Logic
    const handleDeleteClick = (id) => {
        setRowToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    // --- DELETE API ---
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${rowToDelete}`);
            setRows(rows.filter(row => row._id !== rowToDelete)); 
            setIsDeleteDialogOpen(false);
            setRowToDelete(null);
            alert("Post and Cloudinary image deleted permanently.");
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Could not delete. Check backend console.");
        }
    };

    // Edit Logic
    const handleEditClick = (row) => {
        setEditingPost({
            ...row,
            category: row.category?._id || row.category || "",
            slug: row.slug || "", 
            tags: row.tags || []  
        });
        setIsEditOpen(true);
    };

    // --- UPDATE API ---
    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editingPost.title);
            formData.append('status', editingPost.status);
            formData.append('category', editingPost.category); 
            formData.append('slug', editingPost.slug);
            
            if (editingPost.tags) {
                formData.append('tags', Array.isArray(editingPost.tags) ? editingPost.tags.join(',') : editingPost.tags);
            }
            if (editingPost.imageFile) {
                formData.append('image', editingPost.imageFile);
            }
    
            const response = await axios.put(
                `http://localhost:5000/api/posts/${editingPost._id}`, 
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            // --- THE MAGIC FIX ---
            // 1. Find the full category object from your 'categories' list using the ID
            const selectedCat = categories.find(cat => cat._id === editingPost.category);
            
            // 2. Find the existing author from the current row (so we don't lose it)
            const existingRow = rows.find(r => r._id === editingPost._id);
    
            // 3. Create the "Perfect Object" for the Table
            const updatedRowForTable = {
                ...response.data, // This has the new title, status, etc.
                category: selectedCat ? { _id: selectedCat._id, name: selectedCat.name } : existingRow.category,
                author: existingRow ? existingRow.author : { name: 'Unknown' } // Keep the author object intact
            };
    
            // 4. Update the state
            setRows(prevRows => prevRows.map(row => 
                row._id === editingPost._id ? updatedRowForTable : row
            ));
    
            setIsEditOpen(false);
    
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update post.");
        }
    };

    // 4. DataGrid Columns Setup
    const columns = [
        { 
            field: 'title', 
            headerName: 'Post Title', 
            flex: 2, 
            minWidth: 300,
            renderCell: (params) => (
                <Typography sx={{ fontWeight: 700, color: '#1a2027', fontSize: '0.88rem' }}>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'category', 
            headerName: 'Category', 
            flex: 1, 
            minWidth: 150,
            valueGetter: (value, row) => {
                return row?.category?.name || 'Uncategorized';
            },
            renderCell: (params) => {
                const categoryName = params.row?.category?.name || 'Uncategorized';
                
                const categoryColors = {
                    'Development': { text: '#1976d2', bg: '#e3f2fd' },
                    'Design': { text: '#9c27b0', bg: '#f3e5f5' },
                    'Backend': { text: '#2e7d32', bg: '#e8f5e9' },
                    'AI & Tech': { text: '#ed6c02', bg: '#fff3e0' },
                    'Marketing': { text: '#d32f2f', bg: '#ffebee' },
                    'Database': { text: '#607d8b', bg: '#eceff1' }
                };
    
                const style = categoryColors[categoryName] || { text: '#555', bg: '#f5f5f5' };
    
                return (
                    <Chip 
                        label={categoryName} 
                        size="small"
                        sx={{ 
                            fontWeight: 700, fontSize: '11px', 
                            color: style.text, bgcolor: style.bg,
                            borderRadius: '6px', px: 1
                        }} 
                    />
                );
            }
        },
        { 
        
                field: 'author', 
                headerName: 'Author', 
                flex: 0.7, 
                minWidth: 110,
                valueGetter: (value, row) => row?.author?.name || 'Unknown',
                renderCell: (params) => (
                    <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>
                        {params.row?.author?.name || 'Unknown'}
                    </Typography>
                )
            
        },
        { 
            field: 'status', 
            headerName: 'Status',
            flex: 0.7,
            minWidth: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small"
                    sx={{ 
                        fontWeight: 800, fontSize: '10px', textTransform: 'uppercase',
                        color: params.value === 'Published' ? '#1b5e20' : '#e65100',
                        bgcolor: params.value === 'Published' ? '#e8f5e9' : '#fff3e0',
                    }} 
                />
            )
        },
        { 
            field: 'createdAt', 
            headerName: 'Date', 
            flex: 0.8, 
            minWidth: 130,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.85rem', color: '#888' }}>
                    {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.6,
            minWidth: 110,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ height: '100%', alignItems: 'center' }}>
                    <IconButton size="small" color="primary" onClick={() => handleEditClick(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];


    // 5. Render
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1600px', mx: 'auto' }}>
            
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>Content Library</Typography>
                    <Typography variant="body2" color="textSecondary">Manage your published and draft articles.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-post')}
                    sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 800, textTransform: 'none', boxShadow: 'none' }}
                >
                    Create New Post
                </Button>
            </Stack>

            {/* Toolbar Area */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 4, border: '1px solid #eee', display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    placeholder="Search posts..."
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ width: { xs: '100%', md: '400px' } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#aaa' }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3, bgcolor: '#fcfcfc' }
                        }
                    }}
                />
                
                {/* Filter Button with Menu */}
                <Box>
                    <Button 
                        variant="outlined" 
                        startIcon={<FilterListIcon />} 
                        onClick={handleFilterClick}
                        sx={{ borderRadius: 3, textTransform: 'none', color: '#666', borderColor: '#ddd' }}
                    >
                        Status: {statusFilter}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleFilterClose()}
                    >
                        <MenuItem onClick={() => handleFilterClose('All')}>All Posts</MenuItem>
                        <MenuItem onClick={() => handleFilterClose('Published')}>Published</MenuItem>
                        <MenuItem onClick={() => handleFilterClose('Draft')}>Draft</MenuItem>
                    </Menu>
                </Box>
            </Paper>

            {/* DataGrid */}
            <Paper elevation={0} sx={{ width: '100%', borderRadius: 5, border: '1px solid #eee', overflow: 'hidden' }}>
                <DataGrid
                    loading={loading}
                    rows={filteredRows}
                    columns={columns}
                    getRowId={(row) => row._id} 
                    autoHeight
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    sx={{ border: 'none' }}
                />
            </Paper>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} slotProps={{ paper: { sx: { borderRadius: 4, width: '100%', maxWidth: '350px' } } }}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                    <WarningAmberIcon sx={{ color: '#ed6c02', fontSize: 50, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Delete Post?</Typography>
                    <DialogContentText sx={{ fontSize: '14px', mt: 1, mb: 3 }}>
                        This action is permanent. Do you really want to remove this content?
                    </DialogContentText>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outlined" fullWidth sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
                        <Button onClick={confirmDelete} variant="contained" color="error" fullWidth sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}>Delete</Button>
                    </Stack>
                </Box>
            </Dialog>

            {/* --- Full Screen Edit Modal --- */}
            <Dialog
                fullScreen
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                slots={{ transition: Transition }}
            >
                <AppBar sx={{ position: 'relative', bgcolor: 'white', color: 'black', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setIsEditOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, fontWeight: 600 }} variant="h6">
                            Edit Post: {editingPost?.title}
                        </Typography>
                        <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSave}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                            Save Changes
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="md" sx={{ mt: 4, pb: 10 }}>
                    <Stack spacing={4}>

                        {/* Title Edit - Simplified Logic */}
                        <TextField
                            fullWidth
                            label="Post Title"
                            variant="standard"
                            value={editingPost?.title || ''}
                            onChange={(e) => {
                                const newTitle = e.target.value;
                                setEditingPost(prev => ({
                                    ...prev, 
                                    title: newTitle,
                                    slug: prev.id ? prev.slug : generateKeywordSlug(newTitle)
                                }));
                            }}
                            slotProps={{ 
                                input: { sx: { fontSize: '1.5rem', fontWeight: 600 } },
                                inputLabel: { shrink: true } 
                            }}
                        />

                        {/* Category & Status Selection */}
                        <Stack direction="row" spacing={2}>
                            
                        <TextField
                            select
                            label="Category"
                            fullWidth
                            // Row-te category object thakle tar _id nibe, nahole editingPost.category (string) nibe
                            value={typeof editingPost?.category === 'object' ? editingPost.category._id : (editingPost?.category || '')}
                            onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>

                            <TextField
                                select
                                label="Status"
                                fullWidth
                                value={editingPost?.status || ''}
                                onChange={(e) => setEditingPost({...editingPost, status: e.target.value})}
                            >
                                <MenuItem value="Published">Published</MenuItem>
                                <MenuItem value="Draft">Draft</MenuItem>
                            </TextField>
                        </Stack>

                        {/* Slug & Tags Stack */}
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Post Slug"
                                value={editingPost?.slug || ''}
                                onChange={(e) => {
                                    const updatedSlug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                    setEditingPost({...editingPost, slug: updatedSlug});
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>
                                                    yoursite.com/blog/
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <Autocomplete
                                multiple
                                freeSolo
                                options={['React', 'Web Dev', 'JavaScript']}
                                value={editingPost?.tags || []}
                                onChange={(event, newValue) => {
                                    setEditingPost({...editingPost, tags: newValue});
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tags" placeholder="Add more tags" />
                                )}
                            />
                        </Stack>
                    </Stack>
                </Container>
            </Dialog>

        </Box>
    );
};

export default AllPosts;