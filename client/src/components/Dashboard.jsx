import React, { useState, useEffect } from "react"
import { Grid, Paper, Typography } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import axios from "axios"

function Dashboard() {
  const [leadStats, setLeadStats] = useState([])

  useEffect(() => {
    fetchLeadStats()
  }, [])

  const fetchLeadStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/lead-stats`)
      setLeadStats(response.data)
    } catch (error) {
      console.error("Error fetching lead stats:", error)
    }
  }

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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {/* Add recent activity content here */}
          <Typography>No recent activity to display.</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Dashboard

