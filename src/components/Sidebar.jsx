import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from '@mui/icons-material/Inbox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        const role = localStorage.getItem("role");
        if (role === "mentor") {
            navigate("/mentor/profile");
        } else if (role === "mentee") {
            navigate("/mentee/profile");
        } else {
            console.error("Rol bulunamadı.");
        }
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            localStorage.removeItem("role");
            navigate("/login");
        });
    };

    const handleHomeClick = () => {
        navigate("/home");
    };

    return (
        <div style={{ width: 250, paddingTop: "20px" }}>
            <List>
                <ListItem button onClick={handleHomeClick}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ana Sayfa" />
                </ListItem>

                <ListItem button onClick={handleProfileClick}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profilim" />
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/mentee/mentor-list">
                        <ListItemIcon>
                            <SearchIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mentor Bul" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/mentor/incoming-requests">
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gelen Talepler" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/calendar">
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary="Takvim" />
                    </ListItemButton>
                </ListItem>

                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Çıkış Yap" />
                </ListItem>
            </List>
        </div>
    );
};

export default Sidebar;
