import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, List, Typography, ListItem, ListItemButton,
         ListItemIcon, ListItemText, ListSubheader,Badge, 
         IconButton, Stack, Avatar, Divider,Menu, MenuItem} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CollectionsIcon from '@mui/icons-material/Collections';
import CategoryIcon from '@mui/icons-material/Category';
import ForumIcon from '@mui/icons-material/Forum';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/BarChart'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import DnsIcon from '@mui/icons-material/Dns'; 
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


const drawerWidth = 260;

const MainLayout = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget); 
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('user');  
        handleClose(); 
        navigate('/login'); 
    };
  
    const menuGroups = [
        {
            subheader: 'MAIN',
            items: [{ text: 'Dashboard', icon: <DashboardIcon />, path: '/' }]
        },
        {
            subheader: 'CONTENT',
            items: [
                { text: 'All Posts', icon: <ArticleIcon />, path: '/posts' },
                { text: 'Create Post', icon: <AddCircleIcon />, path: '/create-post' },
                { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
                { text: 'Media Gallery', icon: <CollectionsIcon />, path: '/media' },
            ]
        },
        {
            subheader: 'COMMUNITY',
            items: [
                { text: 'Comments', icon: <ForumIcon />, path: '/comments' },
                { text: 'Users', icon: <PeopleIcon />, path: '/users' },
            ]
        },
        {
            subheader: 'SYSTEM',
            items: [
                { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
                { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
                { text: 'Server Status', icon: <DnsIcon />, path: '/server-status' },
            ]
        }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Navbar with Modern Glassmorphism & Gradient Border */}
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1, 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Translucent White
                    backdropFilter: 'blur(10px)', // Glass Effect
                    boxShadow: 'none', 
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    color: '#333'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Brand Name with Gradient Text */}
                    <Typography 
                        variant="h6" 
                        noWrap 
                        component="div" 
                        sx={{ 
                            fontWeight: 900, 
                            letterSpacing: '-0.8px',
                            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Box 
                            sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: '#1976d2', 
                                borderRadius: 1.5, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                                overflow: 'hidden' 
                            }}
                        >
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M12 2L2 7L12 12L22 7L12 2Z" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                                <path 
                                    d="M2 17L12 22L22 17" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                                <path 
                                    d="M2 12L12 17L22 12" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Box>
                        SuperBlog
                    </Typography>

                    {/* Right Side Icons: Notification & Profile */}
                    <Stack direction="row" spacing={2} alignItems="center">

                        {/* Notification Icon */}
                        <IconButton size="small" sx={{ bgcolor: '#f5f5f5' }}>
                            <Badge badgeContent={4} color="error">
                                <NotificationsNoneIcon fontSize="small" />
                            </Badge>
                        </IconButton>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, my: 'auto' }} />

                        {/* --- Profile Clickable Area --- */}
                        <Stack 
                            direction="row" 
                            spacing={1} 
                            alignItems="center" 
                            onClick={handleProfileClick} 
                            sx={{ 
                                cursor: 'pointer',
                                p: 0.5,
                                borderRadius: '20px',
                                transition: '0.2s',
                                '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                        >
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', lineHeight: 1 }}>
                                    CheSubhro
                                </Typography>
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '10px' }}>
                                    Super Admin
                                </Typography>
                            </Box>
                            <Avatar 
                                sx={{ 
                                    width: 35, height: 35, bgcolor: '#1976d2', 
                                    fontSize: '14px', fontWeight: 700, border: '2px solid white' 
                                }}
                            >
                                C
                            </Avatar>
                        </Stack>

                        {/* --- Dropdown Menu (Hidden initially) --- */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    mt: 1.5,
                                    minWidth: 160,
                                    overflow: 'visible',
                                    borderRadius: 2,
                                    '&:before': { 
                                        content: '""', display: 'block', position: 'absolute',
                                        top: 0, right: 14, width: 10, height: 10,
                                        bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            <MenuItem onClick={() => navigate('/users')}>
                                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                My Profile
                            </MenuItem>
                            
                            <Divider sx={{ my: 1 }} />
                            
                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>

                    </Stack>

                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { 
                        width: drawerWidth, 
                        boxSizing: 'border-box',
                        borderRight: '1px solid #f0f0f0',
                        bgcolor: '#ffffff'
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', mt: 1 }}>
                    {/* 2. LOOP: Nested map logic */}
                    {menuGroups.map((group) => (
                        <List
                            key={group.subheader}
                            subheader={
                                <ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 800, fontSize: '11px', color: '#999', lineHeight: '30px', mt: 2 }}>
                                    {group.subheader}
                                </ListSubheader>
                            }
                        >
                            {group.items.map((item) => (
                                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton 
                                        onClick={() => navigate(item.path)}
                                        selected={location.pathname === item.path}
                                        sx={{
                                            minHeight: 44,
                                            px: 2.5,
                                            borderRadius: '0 20px 20px 0',
                                            marginRight: '10px',
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: '#e3f2fd',
                                                color: '#1976d2',
                                                '& .MuiListItemIcon-root': { color: '#1976d2' },
                                                '&:hover': { backgroundColor: '#e3f2fd' }
                                            },
                                            '&:hover': { backgroundColor: '#f9f9f9' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.text} 
                                            primaryTypographyProps={{ 
                                                fontSize: '13.5px', 
                                                fontWeight: location.pathname === item.path ? 700 : 500 
                                            }} 
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ))}
                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8, width: `calc(100% - ${drawerWidth}px)`,bgcolor: '#fcfcfc', minHeight: '100vh' }}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout;