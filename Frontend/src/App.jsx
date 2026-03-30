import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts & Pages
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AllPosts from './pages/AllPosts';
import CreatePost from './pages/CreatePost';
import Media from './pages/Media';
import Categories from './pages/Categories'
import Comments from './pages/Comments';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ServerStatus from './pages/ServerStatus';
import Login from './pages/Login';

// --- Auth Guard Component ---
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return (token && isAuthenticated) ? <Outlet /> : <Navigate to="/login" replace />;
};

// Custom Theme
const theme = createTheme({
    palette: {
      primary: { main: '#1976d2' },
      background: { default: '#f4f6f8' },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route 
                        path="/login" 
                        element={localStorage.getItem('token') ? <Navigate to="/" replace /> : <Login />} 
                    />

                    {/* Private Routes: */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="categories" element={<Categories />} /> 
                            <Route path="create-post" element={<CreatePost />} />
                            <Route path="posts" element={<AllPosts />} />
                            <Route path="media" element={<Media />} /> 
                            <Route path="comments" element={<Comments />} />  
                            <Route path="users" element={<Users />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="server-status" element={<ServerStatus />} />  
                        </Route>
                    </Route>

                    {/* If anyone put wrong URL then goes to login page*/}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
