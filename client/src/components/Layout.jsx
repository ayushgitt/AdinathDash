import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Dashboard as DashboardIcon, People, Assignment, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function Layout({ children, userRole }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AdinathTV Dashboard
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/login')}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => navigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dashboard/leads')}>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="Leads" />
            </ListItem>
            {userRole === 'Admin' && (
              <ListItem button onClick={() => navigate('/dashboard/users')}>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;