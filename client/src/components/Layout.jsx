import React from "react";
import { Link, useLocation } from "react-router-dom";
import img3 from "../image/loginlogo.jpeg";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { Dashboard as DashboardIcon, People, Assignment, Book, Settings, Logout } from "@mui/icons-material";

const drawerWidth = 240;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

function Layout({ children, userRole, onLogout }) {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    { title: "Leads", icon: Assignment, path: "/leads" },
    { title: "Booking", icon: Book, path: "/booking" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  if (userRole === "Admin") {
    menuItems.splice(1, 0, { title: "Employee", icon: People, path: "/users" });
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#ee9121",
        }}
      >
        <Toolbar>
          <Box
            component="img"
            src={img3}
            alt="Adinath Logo"
            sx={{
              width: 40,
              height: 40,
              marginRight: 2,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                animation: `${pulse} 2s infinite ease-in-out`,
              },
            }}
          />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AdinathTV Dashboard
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.title}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon sx={{ color: "#7e1519" }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ color: "#7e1519" }} />
              </ListItem>
            ))}
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