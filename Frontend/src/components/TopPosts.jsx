import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Box, Chip, Skeleton 
} from '@mui/material';

const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
        case 'published': 
        case 'live': return { color: '#4caf50', label: 'Live' };
        case 'draft': return { color: '#ff9800', label: 'Draft' };
        case 'review': return { color: '#2196f3', label: 'Review' };
        default: return { color: '#9097a7', label: 'Unknown' };
    }
};

const TopPosts = ({ searchTerm = "" }) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/posts'); 
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPosts();
    }, []);

    // Frontend filtering logic
    const filteredPosts = posts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const authorName = typeof post.author === 'object' ? post.author.name : (post.author || '');
        const authorMatch = authorName.toLowerCase().includes(searchTerm.toLowerCase());
        
        return titleMatch || authorMatch;
    });
    

    return (
        <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
                borderRadius: '16px', 
                border: '1px solid #eff2f5', 
                p: 1,
                bgcolor: '#ffffff'
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a2035' }}>
                    Top Performing Content
                </Typography>
            </Box>

            <Table sx={{ minWidth: 600 }}>
                <TableHead sx={{ bgcolor: '#fbfcfd' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#9097a7' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#9097a7' }}>Author</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#9097a7' }}>Views</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#9097a7' }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        [...Array(4)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton width="80%" /></TableCell>
                                <TableCell><Skeleton width="60%" /></TableCell>
                                <TableCell><Skeleton width="40%" /></TableCell>
                                <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                            </TableRow>
                        ))
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((row) => {
                            const statusStyle = getStatusStyles(row.status);
                            
                            // Author Object theke Name ber kora (CRITICAL FIX)
                            const authorDisplay = typeof row.author === 'object' ? row.author.name : (row.author || 'Anonymous');

                            return (
                                <TableRow key={row._id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                                    <TableCell>{authorDisplay}</TableCell>
                                    <TableCell>{row.views || 0}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={statusStyle.label} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: `${statusStyle.color}15`, 
                                                color: statusStyle.color, 
                                                fontWeight: 700,
                                                borderRadius: '6px'
                                            }} 
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
                                    🔍 No results found for "{searchTerm}"
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TopPosts;