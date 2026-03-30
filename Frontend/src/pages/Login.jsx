import React, { useState } from 'react';
import axios from 'axios';
import { 
    Box, Paper, Typography, TextField, Button, 
    InputAdornment, IconButton, Checkbox, FormControlLabel,
    Stack, Alert, CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const navigate = useNavigate();
    
    // States
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); 
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
    
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                localStorage.setItem('isAuthenticated', 'true');
    
                navigate('/');
            }
        } catch (err) {
            // Error handling
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            height: '100vh', width: '100vw', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
        }}>
            <Paper elevation={10} sx={{ 
                p: { xs: 4, md: 6 }, width: '90%', maxWidth: '420px', 
                borderRadius: 8, textAlign: 'center' 
            }}>
                <Box sx={{ 
                    width: 60, height: 60, bgcolor: '#1976d2', borderRadius: 4, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    mx: 'auto', mb: 3, boxShadow: '0 10px 20px rgba(25, 118, 210, 0.3)' 
                }}>
                    <LockOutlinedIcon sx={{ color: '#fff', fontSize: 30 }} />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>Sign In</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>Admin Dashboard Access</Typography>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth name="email" label="Email Address"
                            placeholder="admin@gmail.com"
                            value={formData.email} onChange={handleChange}
                            required
                            slotProps={{ input: { sx: { borderRadius: 4 } } }}
                        />

                        <TextField
                            fullWidth name="password" label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password} onChange={handleChange}
                            required
                            slotProps={{
                                input: {
                                    sx: { borderRadius: 4 },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <Button
                            type="submit" variant="contained" fullWidth
                            disabled={loading}
                            sx={{ 
                                py: 1.8, borderRadius: 4, fontWeight: 800, 
                                textTransform: 'none', fontSize: '16px' 
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;