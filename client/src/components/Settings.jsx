import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Person, VpnKey, Schedule, Description } from '@mui/icons-material';

function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="User Settings" secondary="Manage user accounts and roles" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <VpnKey />
            </ListItemIcon>
            <ListItemText primary="API Settings" secondary="Manage API keys and access" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Schedule />
            </ListItemIcon>
            <ListItemText primary="Schedule Jobs" secondary="Manage automated tasks and schedules" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary="Templates" secondary="Manage message templates" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default Settings;

