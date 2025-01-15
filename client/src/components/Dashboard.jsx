import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import UserManagement from './UserManagement';
import LeadManagement from './LeadManagement';

const mockData = [
  { name: 'Jan', leads: 4 },
  { name: 'Feb', leads: 3 },
  { name: 'Mar', leads: 6 },
  { name: 'Apr', leads: 8 },
  { name: 'May', leads: 7 },
];

function DashboardHome() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lead Statistics
          </Typography>
          <BarChart width={500} height={300} data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="leads" fill="#8884d8" />
          </BarChart>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {/* Add recent activity content here */}
        </Paper>
      </Grid>
    </Grid>
  );
}

function Dashboard({ userRole }) {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/leads" element={<LeadManagement />} />
      {userRole === 'Admin' && <Route path="/users" element={<UserManagement />} />}
    </Routes>
  );
}

export default Dashboard;