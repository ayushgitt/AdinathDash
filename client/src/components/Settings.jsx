import React from "react"
import { Box, Typography, Card, CardContent, CardActions, Button, styled } from "@mui/material"
import { Person, VpnKey, Schedule, Description, ArrowForward } from "@mui/icons-material"

// Styled components for custom card and button effects
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#7e1519",
  color: "white",
  "&:hover": {
    backgroundColor: "#fdedd1",
    color: "#7e1519",
  },
  transition: "background-color 0.3s ease, color 0.3s ease",
}))

function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // Two cards in the same row
          gap: 3, // Gap between cards
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr", // Switch to one column on smaller screens
          },
        }}
      >
        {/* User Settings Card */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person sx={{ fontSize: 40, color: "#7e1519", mr: 2 }} />
              <Typography variant="h6">User Settings</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manage user accounts and roles
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <StyledButton endIcon={<ArrowForward />}>Details</StyledButton>
          </CardActions>
        </StyledCard>

        {/* API Settings Card */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <VpnKey sx={{ fontSize: 40, color: "#7e1519", mr: 2 }} />
              <Typography variant="h6">API Settings</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manage API keys and access
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <StyledButton endIcon={<ArrowForward />}>Details</StyledButton>
          </CardActions>
        </StyledCard>

        {/* Schedule Card */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Schedule sx={{ fontSize: 40, color: "#7e1519", mr: 2 }} />
              <Typography variant="h6">Schedule</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manage automated tasks and schedules
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <StyledButton endIcon={<ArrowForward />}>Details</StyledButton>
          </CardActions>
        </StyledCard>

        {/* Profile Update Card */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Description sx={{ fontSize: 40, color: "#7e1519", mr: 2 }} />
              <Typography variant="h6">Profile Update</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manage your profile
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <StyledButton endIcon={<ArrowForward />}>Details</StyledButton>
          </CardActions>
        </StyledCard>
      </Box>
    </Box>
  )
}

export default Settings