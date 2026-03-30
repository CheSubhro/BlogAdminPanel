import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, InputBase, Paper, Stack, IconButton, Typography, 
    List, ListItem, ListItemText, Divider, ClickAwayListener 
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';

const CommandBar = ({ searchTerm, setSearchTerm }) => {

    const [results, setResults] = useState({ users: [], posts: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    // Keyboard Shortcut (CMD+K / CTRL+K)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                inputRef.current.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Debounced API Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1) {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/users/search/all?query=${searchTerm}`);
                    setResults(data);
                    setShowDropdown(true);
                } catch (err) {
                    console.error("Search API Error:", err);
                }
            } else {
                setShowDropdown(false);
            }
        }, 400); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Close dropdown
    const handleClickAway = () => {
        setShowDropdown(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ width: '100%', mb: 4, position: 'relative' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                        transition: 'all 0.3s ease',
                        '&:focus-within': {
                            borderColor: '#1976d2',
                            boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.15)',
                            background: '#ffffff',
                        }
                    }}
                >
                    <SearchIcon sx={{ color: 'text.secondary', mr: 1.5 }} />
                    
                    <InputBase
                        inputRef={inputRef} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length > 1 && setShowDropdown(true)}
                        sx={{ ml: 1, flex: 1, fontWeight: 500, fontSize: '0.95rem' }}
                        placeholder="Search dashboard... (Press ⌘K)"
                    />

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ 
                            display: { xs: 'none', md: 'flex' }, 
                            alignItems: 'center', gap: 0.5, bgcolor: '#f5f5f5', 
                            px: 1, py: 0.5, borderRadius: 1.5, border: '1px solid #e0e0e0'
                        }}>
                            <KeyboardCommandKeyIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>K</Typography>
                        </Box>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <TuneIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Paper>

                {/* --- Search Results Dropdown --- */}
                {showDropdown && (
                    <Paper sx={{ 
                        position: 'absolute', top: '105%', left: 0, right: 0, 
                        zIndex: 100, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
                        overflow: 'hidden', border: '1px solid #f0f0f0' 
                    }}>
                        <List dense sx={{ py: 1 }}>
                            {/* Posts Section */}
                            {results.posts.length > 0 && (
                                <>
                                    <Typography variant="caption" sx={{ px: 2, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                                        Posts
                                    </Typography>
                                    {results.posts.map((post) => (
                                        <ListItem key={post._id} component={Link} to={`/posts/${post.slug}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { bgcolor: '#f0f7ff' } }}>
                                            <ListItemText 
                                                primary={post.title} 
                                                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                            />
                                        </ListItem>
                                    ))}
                                </>
                            )}

                            {results.posts.length > 0 && results.users.length > 0 && <Divider sx={{ my: 1 }} />}

                            {/* Users Section */}
                            {results.users.length > 0 && (
                                <>
                                    <Typography variant="caption" sx={{ px: 2, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                                        Users
                                    </Typography>
                                    {results.users.map((user) => (
                                        <ListItem key={user._id} component={Link} to={`/users`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { bgcolor: '#f0f7ff' } }}>
                                            <ListItemText 
                                                primary={user.name} 
                                                secondary={user.role}
                                                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                    ))}
                                </>
                            )}

                            {/* No Results found */}
                            {results.posts.length === 0 && results.users.length === 0 && (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">No results found for "{searchTerm}"</Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                )}

                {/* Tags Section */}
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, px: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mr: 1 }}>
                        Recent:
                    </Typography>
                    {['React 19', 'Strapi Fix', 'CSS Grid'].map((tag) => (
                        <Typography 
                            key={tag} 
                            variant="caption" 
                            onClick={() => setSearchTerm(tag)}
                            sx={{ 
                                color: '#1976d2', cursor: 'pointer', fontWeight: 700, mr: 1,
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            #{tag}
                        </Typography>
                    ))}
                </Stack>
            </Box>
        </ClickAwayListener>
    );
};

export default CommandBar;