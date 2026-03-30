
import React,{useState} from 'react';
import { Box, Grid, Stack } from '@mui/material';
import CommandBar from '../components/CommandBar'
import WelcomeHero from '../components/WelcomeHero'
import QuickActions from '../components/QuickActions';
import StatsCards from '../components/StatCards';
import TopPosts from '../components/TopPosts';
import UserGrowthChart from '../components/UserGrowthChart';
import RecentUsers from '../components/RecentUsers';
import RoleDistribution from '../components/RoleDistribution';

const Dashboard = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <Box sx={{ p: 3, bgcolor: '#fbfbfb', minHeight: '100vh' }}>
            {/* 1. Global Search */}
            <CommandBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* 2. Welcome Section & Quick Actions */}
            <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', md: 'center' }} 
                spacing={{ xs: 3, md: 0 }} 
                sx={{ 
                    mb: 6, 
                    mt: 2, 
                    width: '100%',
                    gap: 5 
                }}
            >
                <Box>
                    <WelcomeHero name={user ? user.name : "Guest"} />
                </Box>
                
                <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <QuickActions />
                </Box>
            </Stack>

            {/* 3. Overview Stats */}
            <StatsCards />

            <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* 4. Charts & Main Content (Left Side) */}
                <Grid item xs={12} lg={8}>
                    <Stack spacing={3}>
                        <UserGrowthChart />
                        <TopPosts searchTerm={searchTerm}/>
                    </Stack>
                </Grid>

                {/* 5. Role Distribution & Recent Users (Right Side) */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        <RoleDistribution />
                        <RecentUsers />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;


// // src/pages/Dashboard.jsx
// import React from 'react';
// import { Box, Typography,Grid } from '@mui/material';
// import ChartSection from '../components/ChartSection'
// import StatCards from '../components/StatCards'
// import TrafficCharts from '../components/TrafficCharts'
// import QuickActions from '../components/QuickActions'
// import VisitorMap from '../components/VisitorMap'
// import SystemAlerts from '../components/SystemAlerts'
// import CalendarWidget from '../components/CalendarWidget'
// import TopPosts from '../components/TopPosts'
// import ServerStatus from '../components/ServerStatus'
// import CommandBar from '../components/CommandBar'
// import PerformanceTable from '../components/PerformanceTable'
// import SystemHealth from '../components/SystemHealth'
// import WelcomeHero from '../components/WelcomeHero'

// const Dashboard = () => {
//     return (
//         <Box sx={{ width: '100%', p: 2 }}>
//             {/* Row 0: Universal Search/Command Bar */}
//             <CommandBar />

//             {/* Personalized Welcome Section */}
//             <WelcomeHero />

//             <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Dashboard Overview</Typography>
            
//             {/* Row 1: Stat Cards */}
//             <StatCards />

//             {/* Row 2: Map & Calendar (md=8 + md=4 = 12) */}
//             {/* <Grid container spacing={3} sx={{ mb: 3 }}>
//                 <Grid item xs={12} md={8}><VisitorMap /></Grid>
//                 <Grid item xs={12} md={4}><CalendarWidget /></Grid>
//             </Grid> */}

//             {/* Row 3: Alerts & Area Chart (md=4 + md=8 = 12) */}
//             {/* <Grid container spacing={3} sx={{ mb: 3 }}>
//                 <Grid item xs={12} md={4}><SystemAlerts /></Grid>
//                 <Grid item xs={12} md={8}><ChartSection /></Grid>
//             </Grid> */}

//             {/* Row 4: Traffic Charts + SYSTEM STATUS */}
//             {/* <Box sx={{ mb: 4 }}>
//                 <TrafficCharts />
//                 <ServerStatus /> 
//             </Box> */}

//             {/* Row 5: Top Posts */}
//             <TopPosts/>

//             {/* OR */}
//             {/* <PerformanceTable /> */}

//             {/* <SystemHealth /> */}

//             {/* Row 6: Quick Actions */}
//             <QuickActions />
//         </Box>
//     );
// };

// export default Dashboard;