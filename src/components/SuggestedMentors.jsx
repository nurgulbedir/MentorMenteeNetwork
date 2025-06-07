// src/components/SuggestedMentors.jsx

import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";

const SuggestedMentors = () => {
    // Şimdilik statik veri — sonra Firestore'dan çekeceğiz
    const mentors = [
        { name: "Ahmet Yılmaz", expertise: "Yapay Zeka" },
        { name: "Elif Kaya", expertise: "Veri Bilimi" },
        { name: "Mehmet Can", expertise: "Mobil Geliştirme" },
    ];

    return (
        <Stack spacing={2}>
            {mentors.map((mentor, index) => (
                <Card key={index}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {mentor.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {mentor.expertise}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
};

export default SuggestedMentors;
