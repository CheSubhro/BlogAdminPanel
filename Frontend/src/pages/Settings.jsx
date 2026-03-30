// User Profile/Role management


import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { 
    Box, Typography, Paper, Stack, TextField, Button, 
    Avatar, Divider, Tab, Tabs, Grid, Switch, IconButton,
    Snackbar, Alert, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';


const Settings = () => {

    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [errors, setErrors] = useState({});

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [formData, setFormData] = useState({
        siteTitle: 'SuperBlog Admin',
        tagline: 'The ultimate full-stack blogging engine',
        adminEmail: 'admin@superblog.com',
        maintenanceMode: true,
        firstName: 'Che',
        lastName: 'Subhro',
        bio: '',
        github: 'github.com/CheSubhro',
        newPassword: '',
        confirmPassword: ''
    });

    // ---  Initial Data Fetch Logic ---
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/settings');
                if (res.data) {
                    setFormData(prev => ({
                        ...prev,
                        siteTitle: res.data.siteTitle || '',
                        tagline: res.data.tagline || '',
                        adminEmail: res.data.adminEmail || '',
                        maintenanceMode: res.data.maintenanceMode || false,
                        firstName: res.data.firstName || '',
                        lastName: res.data.lastName || '',
                        bio: res.data.bio || '',
                        github: res.data.github || ''
                    }));
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleToggle = (e) => {
        setFormData(prev => ({ ...prev, maintenanceMode: e.target.checked }));
    };

    // --- Validation Logic ---
    const validateForm = () => {
        let tempErrors = {};
        
        // 1. Site Title Check
        if (!formData.siteTitle.trim()) tempErrors.siteTitle = "Site Title is required!";
        
        // 2. Email Check 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.adminEmail) {
            tempErrors.adminEmail = "Admin Email is required!";
        } else if (!emailRegex.test(formData.adminEmail)) {
            tempErrors.adminEmail = "Invalid email format!";
        }

        // 3. Password Match Check 
        if (formData.newPassword || formData.confirmPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                tempErrors.confirmPassword = "Passwords do not match!";
            }
            if (formData.newPassword.length < 6) {
                tempErrors.newPassword = "Password must be at least 6 characters!";
            }
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0; 
    };

    // --- 3. Optimized Save Logic with Auth Token ---
    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token'); 
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (tabValue === 0) {
                // General Settings Update
                const generalData = {
                    siteTitle: formData.siteTitle,
                    tagline: formData.tagline,
                    adminEmail: formData.adminEmail,
                    maintenanceMode: formData.maintenanceMode
                };
                await axios.put('http://localhost:5000/api/settings/general', generalData, config);
            } 
            else {
                // Profile & Security Update
                const profileData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    bio: formData.bio,
                    github: formData.github,
                    ...(formData.newPassword && { newPassword: formData.newPassword }) 
                };
                await axios.put('http://localhost:5000/api/settings/profile', profileData, config);
                
                // Password reset fields after save
                setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
            }

            setOpenSnack(true);
        } catch (error) {
            console.error("Error saving settings:", error);
            const errorMsg = error.response?.data?.message || "Failed to save settings.";
            setErrors({ submit: errorMsg });
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <>
            <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: '1200px', mx: 'auto' }}>
                {/* Headers and Tabs Code Remains Same as your previous snippet */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#1a1a1a' }}>System Settings</Typography>
                    <Typography variant="subtitle1" color="textSecondary">Global configuration with dynamic controls.</Typography>
                </Box>

                <Paper elevation={0} sx={{ borderRadius: 6, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                        <Tab label="General" icon={<SettingsIcon />} iconPosition="start" sx={{ fontWeight: 700, py: 3 }} />
                        <Tab label="Profile" icon={<AccountCircleIcon />} iconPosition="start" sx={{ fontWeight: 700, py: 3 }} />
                        <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" sx={{ fontWeight: 700, py: 3 }} />
                    </Tabs>

                    <Box sx={{ p: { xs: 3, md: 8 } }}>
                        {/* Tab 1: General */}
                        {tabValue === 0 && (
                            <Stack spacing={4}>
                                <TextField fullWidth label="Site Title" name="siteTitle" value={formData.siteTitle} onChange={handleChange} error={!!errors.siteTitle} helperText={errors.siteTitle} size="small" />
                                <TextField fullWidth label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} size="small" />
                                <TextField fullWidth label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} error={!!errors.adminEmail} helperText={errors.adminEmail} size="small" />
                                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2">Maintenance Mode</Typography>
                                    <Switch checked={formData.maintenanceMode} onChange={handleToggle} />
                                </Box>
                            </Stack>
                        )}

                        {/* Tab 2: Profile */}
                        {tabValue === 1 && (
                            <Stack spacing={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Avatar sx={{ width: 100, height: 100 }} />
                                    <Button variant="outlined" startIcon={<PhotoCameraIcon />}>Change Photo</Button>
                                </Box>
                                <Stack direction="row" spacing={2}>
                                    <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} size="small" />
                                    <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} size="small" />
                                </Stack>
                                <TextField fullWidth multiline rows={3} label="Bio" name="bio" value={formData.bio} onChange={handleChange} size="small" />
                                <TextField fullWidth label="GitHub URL" name="github" value={formData.github} onChange={handleChange} size="small" />
                            </Stack>
                        )}

                        {/* Tab 3: Security */}
                        {tabValue === 2 && (
                            <Stack spacing={4}>
                                <TextField fullWidth type="password" label="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} error={!!errors.newPassword} helperText={errors.newPassword} size="small" />
                                <TextField fullWidth type="password" label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} size="small" />
                            </Stack>
                        )}

                        <Divider sx={{ my: 4 }} />

                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button disabled={loading}>Discard</Button>
                            <Button 
                                variant="contained" 
                                onClick={handleSave} 
                                disabled={loading}
                                sx={{ bgcolor: '#1a1a1a', '&:hover': { bgcolor: '#333' } }}
                            >
                                {loading ? <CircularProgress size={20} /> : <SaveIcon sx={{ mr: 1 }} />}
                                Save Changes
                            </Button>
                        </Stack>
                    </Box>
                </Paper>

                <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)}>
                    <Alert severity="success">Settings saved successfully!</Alert>
                </Snackbar>
            </Box>  
        </>
    )
}

export default Settings