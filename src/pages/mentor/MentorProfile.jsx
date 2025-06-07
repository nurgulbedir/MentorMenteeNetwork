// src/pages/mentor/MentorProfile.jsx

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { Button, Card, CardContent, Typography, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MentorProfile = () => {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfileData(docSnap.data());
                }
            } catch (error) {
                console.error("Profil verisi çekilirken hata:", error);
            }
        };
        fetchProfile();
    }, [currentUser]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    Mentor Profil Sayfası
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/mentor/profile/edit")}
                    style={{ marginBottom: "20px" }}
                >
                    Profili Düzenle
                </Button>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">Ad Soyad:</Typography>
                        <Typography gutterBottom>{profileData.fullName}</Typography>

                        <Typography variant="h6">Mentor Türü:</Typography>
                        <Typography gutterBottom>{profileData.mentorType}</Typography>

                        <Typography variant="h6">Uzmanlık Alanları:</Typography>
                        <Stack direction="row" spacing={1} mb={2}>
                            {profileData.expertiseAreas?.map((area, index) => (
                                <Chip key={index} label={area} />
                            ))}
                        </Stack>

                        <Typography variant="h6">Teknik Yetkinlikler:</Typography>
                        <Stack direction="row" spacing={1} mb={2}>
                            {profileData.technicalSkills?.map((skill, index) => (
                                <Chip key={index} label={skill} />
                            ))}
                        </Stack>

                        <Typography variant="h6">Eğitim Geçmişi:</Typography>
                        <Typography gutterBottom>{profileData.education}</Typography>

                        <Typography variant="h6">Deneyim Süresi:</Typography>
                        <Typography gutterBottom>{profileData.experienceYears} yıl</Typography>

                        <Typography variant="h6">Hakkımda:</Typography>
                        <Typography gutterBottom>{profileData.bio}</Typography>

                        <Typography variant="h6">Mentorluk Sunabileceği Konular:</Typography>
                        <Stack direction="row" spacing={1} mb={2}>
                            {profileData.mentoringTopics?.map((topic, index) => (
                                <Chip key={index} label={topic} />
                            ))}
                        </Stack>

                        <Typography variant="h6">Mentorluk Tarzı:</Typography>
                        <Typography gutterBottom>{profileData.mentoringStyle}</Typography>

                        <Typography variant="h6">Ulaşılabilirlik Saatleri:</Typography>
                        <Typography gutterBottom>{profileData.availability}</Typography>

                        <Typography variant="h6">İletişim Tercihleri:</Typography>
                        <Typography gutterBottom>{profileData.communicationPreferences}</Typography>

                        <Typography variant="h6">Mentorluk Sıklığı:</Typography>
                        <Typography gutterBottom>{profileData.mentoringFrequency}</Typography>

                        <Typography variant="h6">LinkedIn:</Typography>
                        <Typography gutterBottom>{profileData.linkedin}</Typography>

                        <Typography variant="h6">GitHub:</Typography>
                        <Typography gutterBottom>{profileData.github}</Typography>

                        <Typography variant="h6">Web Sitesi:</Typography>
                        <Typography gutterBottom>{profileData.website}</Typography>

                        <Typography variant="h6">Eşleşmelere Açık mı?:</Typography>
                        <Typography gutterBottom>{profileData.openToMatching ? "Evet" : "Hayır"}</Typography>

                        <Typography variant="h6">Şehir / Ülke:</Typography>
                        <Typography gutterBottom>{profileData.location}</Typography>

                        <Typography variant="h6">Daha önce mentorluk yaptığı kişi sayısı:</Typography>
                        <Typography gutterBottom>{profileData.previousMentees}</Typography>

                        <Typography variant="h6">Puanlama:</Typography>
                        <Typography gutterBottom>{profileData.rating}</Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MentorProfile;
