import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // senin dosya yoluna göre değişebilir

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleProfileClick = () => {
        if (!currentUser) return;

        // Rol bilgisini veritabanından çekmiyorsan localStorage ya da context kullanabilirsin
        const role = localStorage.getItem("role");
        if (role === "mentor") navigate("/mentor/profile");
        else if (role === "mentee") navigate("/mentee/profile");
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/login");
        });
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
        >
            <Toolbar />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleProfileClick}>
                        <ListItemText primary="Profilim" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemText primary="Çıkış Yap" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}
