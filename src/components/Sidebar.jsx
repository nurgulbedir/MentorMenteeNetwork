import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home"; // 🔹 yeni ikon

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
