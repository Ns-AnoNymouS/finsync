import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Logout as LogoutIcon,
  AddBox as AddBoxIcon,
  Menu as MenuIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function DashboardLayout({
  children,
  darkMode,
  setDarkMode,
  selectedItem,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Transactions", icon: <ReceiptIcon />, path: "/transactions" },
    {
      text: "Add Transactions",
      icon: <AddBoxIcon />,
      path: "/add-transaction",
    },
    { text: "Upload Receipt", icon: <UploadIcon />, path: "/upload" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally redirect to login page:
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: darkMode ? "#121212" : "#263238",
        color: darkMode ? "#CFD8DC" : "#ECEFF1",
      }}
    >
      <Box>
        <List>
          {drawerItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              onClick={() => navigate(item.path)}
            >
              <ListItemButton
                selected={selectedItem === item.text}
                sx={{
                  bgcolor:
                    selectedItem === item.text
                      ? darkMode
                        ? "#4CAF50"
                        : "#4CAF50"
                      : "inherit",
                  color: selectedItem === item.text ? "#FFFFFF" : "inherit",
                  "&:hover": {
                    bgcolor: darkMode ? "#455A64" : "#37474F",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout} sx={{ cursor: "pointer" }}>
            <ListItemIcon sx={{ color: "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          bgcolor: darkMode ? "#1E1E1E" : "#00695C",
          color: "#fff",
        }}
        elevation={0}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Title Side-by-Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/header.png"
              alt="FinSync Logo"
              sx={{ height: 40 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", pl: 1 }}>
              FinSync
            </Typography>
          </Box>

          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <FiMoon /> : <FiSun />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            bgcolor: darkMode ? "#121212" : "#263238",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: darkMode ? "#000" : "#f5f5f5",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
