// src/pages/mentee/MentorList.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Grid,
    Avatar,
    Chip,
    Button,
} from "@mui/material";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const MentorList = () => {
    const { currentUser } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const usersRef = collection(db, "users");
                const qSnapshot = await getDocs(usersRef);

                const mentorData = await Promise.all(
                    qSnapshot.docs
                        .filter((docSnapshot) => docSnapshot.data().role === "mentor")
                        .map(async (docSnapshot) => {
                            const userData = docSnapshot.data();

                            const mentorProfileRef = doc(
                                db,
                                "users",
                                docSnapshot.id,
                                "mentorProfile",
                                "profile"
                            );
                            const mentorProfileSnap = await getDoc(mentorProfileRef);

                            const profileData = mentorProfileSnap.exists()
                                ? mentorProfileSnap.data()
                                : {};

                            return {
                                id: docSnapshot.id,
                                email: userData.email || "",
                                name: profileData.name || "",
                                profilePhoto: profileData.profilePhoto || "",
                                mentorType: profileData.mentorType || "",
                                expertiseAreas: profileData.expertiseAreas || [],
                                technicalSkills: profileData.technicalSkills || [],
                                about: profileData.about || "",
                            };
                        })
                );

                setMentors(mentorData);
            } catch (error) {
                console.error("Mentorları çekerken hata oluştu:", error);
            }
        };

        fetchMentors();
    }, []);

    const handleSendRequest = async (mentorId) => {
        try {
            // GÜNCELLENEN KISIM: matchRequests koleksiyonuna gönderiyoruz ✅
            await addDoc(collection(db, "matchRequests"), {
                mentorID: mentorId,
                menteeID: currentUser.uid,
                menteeName: currentUser.displayName || currentUser.email || "Unknown",
                status: "pending",
                createdAt: serverTimestamp(),
            });
            alert("Eşleşme talebi gönderildi!");
        } catch (error) {
            console.error("Eşleşme talebi gönderilirken hata:", error);
        }
    };

    const filteredMentors = mentors.filter((mentor) =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Mentor Ara
            </Typography>
            <TextField
                label="Mentor Ara"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />
            <Grid container spacing={2}>
                {filteredMentors.map((mentor) => (
                    <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src={mentor.profilePhoto}
                                        alt={mentor.name}
                                        sx={{ width: 56, height: 56, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="h6">{mentor.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {mentor.email}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {mentor.mentorType}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="subtitle2">Uzmanlık Alanları:</Typography>
                                <Box mb={1}>
                                    {mentor.expertiseAreas.map((area, index) => (
                                        <Chip key={index} label={area} sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Box>
                                <Typography variant="subtitle2">Teknik Yetenekler:</Typography>
                                <Box mb={1}>
                                    {mentor.technicalSkills.map((skill, index) => (
                                        <Chip key={index} label={skill} sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Box>
                                <Typography variant="subtitle2">Hakkında:</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {mentor.about}
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSendRequest(mentor.id)}
                                    sx={{ mr: 1 }}
                                >
                                    Eşleşme İsteği Gönder
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        (window.location.href = `/mentor/profile/${mentor.id}`)
                                    }
                                >
                                    Profili Gör
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MentorList;

