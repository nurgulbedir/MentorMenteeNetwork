import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { Button, Card, CardContent, Typography, Avatar, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MenteeProfile = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate(); // 

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);


                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1, padding: "2rem" }}>
                <Typography variant="h4" gutterBottom>
                    Mentee Profil Sayfası
                </Typography>

                {/* 🚩 Düzenle butonu */}
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/mentee/profile/edit")}
                    sx={{ mb: 2 }}
                >
                    Profili Düzenle
                </Button>

                {userData ? (
                    <Card sx={{ maxWidth: 800, padding: 3 }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <Avatar
                                    src={userData.profilePhotoUrl || ""}
                                    alt={userData.fullName}
                                    sx={{ width: 80, height: 80 }}
                                />
                                <Typography variant="h5">{userData.fullName}</Typography>
                            </Stack>

                            <Typography><strong>Öğrencilik Durumu:</strong> {userData.studentStatus}</Typography>
                            <Typography><strong>Bölüm / Okul / Mezuniyet Yılı:</strong> {userData.department} / {userData.school} / {userData.graduationYear}</Typography>

                            <Typography mt={2}><strong>İlgi Alanları:</strong></Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {userData.interestTags?.map((tag, index) => (
                                    <Chip key={index} label={tag} />
                                ))}
                            </Stack>

                            <Typography mt={2}><strong>Teknik Bilgi / Bildiği Diller:</strong></Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {userData.knownTechnologies?.map((tech, index) => (
                                    <Chip key={index} label={tech} />
                                ))}
                            </Stack>

                            <Typography mt={2}><strong>Kendini Tanıtan Kısa Biyografi:</strong></Typography>
                            <Typography>{userData.bio}</Typography>

                            <Typography mt={2}><strong>Mentorlukta Ne Arıyor?:</strong> {userData.mentorshipNeeds?.join(", ")}</Typography>

                            <Typography mt={2}><strong>Projeler / Etkinlikler / Yarışmalar:</strong> {userData.projects}</Typography>
                            <Typography mt={2}><strong>CV / Portfolyo:</strong> <a href={userData.portfolioUrl} target="_blank" rel="noopener noreferrer">{userData.portfolioUrl}</a></Typography>
                            <Typography mt={2}><strong>Ulaşılabilirlik Saatleri / Günleri:</strong> {userData.availability}</Typography>
                            <Typography mt={2}><strong>İletişim Tercihleri:</strong> {userData.contactPreference}</Typography>
                            <Typography mt={2}><strong>Geliştirmek İstediği Alanlar:</strong> {userData.areasToImprove?.join(", ")}</Typography>
                            <Typography mt={2}><strong>Hedeflediği Kariyer Yolu:</strong> {userData.careerGoal}</Typography>
                            <Typography mt={2}><strong>Daha önce aldığı mentorluk var mı?:</strong> {userData.hasPreviousMentorship ? "Evet" : "Hayır"}</Typography>
                            <Typography mt={2}><strong>Eşleşmelere Açık mı?:</strong> {userData.isAvailableForMatch ? "Evet" : "Hayır"}</Typography>
                            <Typography mt={2}><strong>Zaman dilimi / Şehir:</strong> {userData.location}</Typography>
                            <Typography mt={2}><strong>Mentor profillerinde hangi özellikleri arıyor?:</strong> {userData.preferredMentorFeatures?.join(", ")}</Typography>

                        </CardContent>
                    </Card>
                ) : (
                    <Typography>Yükleniyor...</Typography>
                )}
            </div>
        </div>
    );
};

export default MenteeProfile;

