
import React from 'react'
import { 
    Grid, Paper, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Avatar, Box, Chip 
} from '@mui/material';

const postPerformance = [
    { id: 1, title: 'React 19 Hooks Guide', views: '45.2k', shares: '1.2k', status: 'Trending' },
    { id: 2, title: 'Strapi v5 Deployment', views: '32.8k', shares: '850', status: 'Popular' },
    { id: 3, title: 'MUI Modern UI Tips', views: '28.4k', shares: '620', status: 'New' },
];

const topAuthors = [
    { id: 1, name: 'CheSubhro', posts: 145, rating: 4.9, img: 'C' },
    { id: 2, name: 'Anik Dev', posts: 82, rating: 4.7, img: 'A' },
    { id: 3, name: 'Srijani UI', posts: 64, rating: 4.8, img: 'S' },
];

const PerformanceTable = () => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Left: Post Performance Table */}
            <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Post Performance</Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, borderBottom: '2px solid #f5f5f5' }}>Content Title</TableCell>
                                    <TableCell sx={{ fontWeight: 700, borderBottom: '2px solid #f5f5f5' }}>Views</TableCell>
                                    <TableCell sx={{ fontWeight: 700, borderBottom: '2px solid #f5f5f5' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {postPerformance.map((post) => (
                                    <TableRow key={post.id} sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell sx={{ py: 2, fontWeight: 500 }}>{post.title}</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>{post.views}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={post.status} 
                                                size="small" 
                                                sx={{ 
                                                    fontSize: '10px', fontWeight: 900, 
                                                    bgcolor: post.status === 'Trending' ? '#e3f2fd' : '#f5f5f5',
                                                    color: post.status === 'Trending' ? '#1976d2' : 'inherit'
                                                }} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            {/* Right: Top Authors List */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #f0f0f0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Top Authors</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {topAuthors.map((author) => (
                            <Box key={author.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#1976d2', fontWeight: 800, fontSize: '0.9rem', width: 40, height: 40 }}>
                                        {author.img}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{author.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">{author.posts} Published Posts</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#2e7d32', bgcolor: '#e8f5e9', px: 1, borderRadius: 1 }}>
                                    ★ {author.rating}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default PerformanceTable