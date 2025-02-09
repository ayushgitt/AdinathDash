import React, { useState, useEffect } from "react"
import { Grid, Paper, Typography, Box, styled } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import axios from "axios"

// Styled components for custom card and hover effects
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[6],
  },
}))

const StyledBarChart = styled(BarChart)(({ theme }) => ({
  "& .recharts-bar": {
    transition: "fill 0.3s ease",
  },
  "& .recharts-bar:hover": {
    fill: "#7e1519", // Change bar color on hover
  },
}))

function Dashboard() {
  const [leadStats, setLeadStats] = useState([])

  useEffect(() => {
    // Dummy data for lead statistics
    const dummyLeadStats = [
      { month: "Jan", leads: 120 },
      { month: "Feb", leads: 150 },
      { month: "Mar", leads: 200 },
      { month: "Apr", leads: 180 },
      { month: "May", leads: 250 },
      { month: "Jun", leads: 300 },
      { month: "Jul", leads: 280 },
      { month: "Aug", leads: 320 },
      { month: "Sep", leads: 400 },
      { month: "Oct", leads: 380 },
      { month: "Nov", leads: 450 },
      { month: "Dec", leads: 500 },
    ]
    setLeadStats(dummyLeadStats)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: "#7e1519", fontWeight: "bold" }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {/* Lead Statistics Card - Full Width */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ color: "#7e1519", fontWeight: "bold" }}>
              Lead Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <StyledBarChart data={leadStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#7e1519" />
                <YAxis stroke="#7e1519" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fdedd1",
                    border: "1px solid #7e1519",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="leads" fill="#8884d8" animationDuration={1500} />
              </StyledBarChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>

        {/* Recent Activity Card - Lower Row */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ color: "#7e1519", fontWeight: "bold" }}>
              Recent Activity
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                No recent activity to display.
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard