import React from "react";
import {
  AppBar, Toolbar, Typography, Button, Avatar,
  Box, Tooltip, IconButton
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 45%)`;
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ cursor: "pointer", flexGrow: 1, letterSpacing: 0.5 }}
          onClick={() => navigate("/")}
        >
          🌐 SocialFeed
        </Typography>

        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: stringToColor(user.username),
                width: 34,
                height: 34,
                fontSize: "0.9rem",
                fontWeight: 700,
              }}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user.username}
            </Typography>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logout} size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              color="inherit"
              variant="outlined"
              sx={{ borderColor: "rgba(255,255,255,0.7)", borderRadius: 2 }}
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              color="inherit"
              variant="contained"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
