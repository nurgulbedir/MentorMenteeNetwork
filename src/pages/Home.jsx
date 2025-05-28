import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

export default function Home() {
    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Ana Sayfa
                </Typography>
                <Typography variant="body1">
                    Burada diğer kullanıcıların gönderileri yer alacak (şimdilik boş).
                </Typography>
            </Box>
        </Box>
    );
}
