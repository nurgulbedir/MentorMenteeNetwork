import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {
    Button,
    TextField,
    Typography,
    Container,
    Chip,
    Stack,
    MenuItem,
    Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const expertiseOptions = [
    "Mobil Geliştirme",
    "Girişimcilik",
    "Yapay Zeka",
    "Web Geliştirme",
    "Veri Bilimi",
    "Siber Güvenlik",
];

const techOptions = [
    "Java",
    "Python",
    "HTML/CSS",
    "React",
    "Node.js",
    "Firebase",
    "Figma",
];

const mentoringTopicsOptions = [
    "CV Hazırlama",
    "Proje Desteği",
    "Teknik Mentorluk",
    "Kariyer Danışmanlığı",
    "Mülakat Hazırlığı",
];

const mentoringStyleOptions = [
    "Yönlendirici",
    "Soru-Cevap",
    "Görev Bazlı",
];

const MentorProfileEdit = () => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        profilePhotoURL: "",
        mentorType: "",
        expertiseAreas: [],
        technicalSkills: [],
        education: "",
        experienceYears: "",
        bio: "",
        mentoringTopics: [],
        mentoringStyle: "",
        availability: "",
        communicationPreferences: "",
        mentoringFrequency: "",
        linkedin: "",
        github: "",
        website: "",
        openToMatching: false,
        location: "",
        previousMentees: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullName: data.fullName || "",
                        profilePhotoURL: data.profilePhotoURL || "",
                        mentorType: data.mentorType || "",
                        expertiseAreas: data.expertiseAreas || [],
                        technicalSkills: data.technicalSkills || [],
                        education: data.education || "",
                        experienceYears: data.experienceYears || "",
                        bio: data.bio || "",
                        mentoringTopics: data.mentoringTopics || [],
                        mentoringStyle: data.mentoringStyle || "",
                        availability: data.availability || "",
                        communicationPreferences: data.communicationPreferences || "",
                        mentoringFrequency: data.mentoringFrequency || "",
                        linkedin: data.linkedin || "",
                        github: data.github || "",
                        website: data.website || "",
                        openToMatching: data.openToMatching || false,
                        location: data.location || "",
                        previousMentees: data.previousMentees || "",
                    });
                }
            } catch (error) {
                console.error("Profil verisi çekilirken hata:", error);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "users", currentUser.uid);
            await setDoc(docRef, formData, { merge: true });
            navigate("/mentor/profile");
        } catch (error) {
            console.error("Profil güncellenirken hata:", error);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <Container maxWidth="md" style={{ paddingTop: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    Mentor Profilini Düzenle
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Ad Soyad"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Profil Fotoğrafı URL"
                        name="profilePhotoURL"
                        value={formData.profilePhotoURL}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Mentor Türü"
                        name="mentorType"
                        value={formData.mentorType}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Akademik">Akademik</MenuItem>
                        <MenuItem value="Sektörel">Sektörel</MenuItem>
                        <MenuItem value="Girişimci">Girişimci</MenuItem>
                        <MenuItem value="Kariyer Koçu">Kariyer Koçu</MenuItem>
                    </TextField>

                    {/* Uzmanlık Alanları */}
                    <Autocomplete
                        multiple
                        options={expertiseOptions}
                        freeSolo
                        value={formData.expertiseAreas}
                        onChange={(event, newValue) => {
                            setFormData((prev) => ({
                                ...prev,
                                expertiseAreas: newValue,
                            }));
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Uzmanlık Alanları" margin="normal" fullWidth />
                        )}
                    />

                    {/* Teknik Yetkinlikler */}
                    <Autocomplete
                        multiple
                        options={techOptions}
                        freeSolo
                        value={formData.technicalSkills}
                        onChange={(event, newValue) => {
                            setFormData((prev) => ({
                                ...prev,
                                technicalSkills: newValue,
                            }));
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Teknik Yetkinlikler" margin="normal" fullWidth />
                        )}
                    />

                    <TextField
                        label="Eğitim Geçmişi"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Deneyim Süresi (Yıl)"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Hakkımda (Biyografi)"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />

                    {/* Mentorluk Konuları */}
                    <Autocomplete
                        multiple
                        options={mentoringTopicsOptions}
                        freeSolo
                        value={formData.mentoringTopics}
                        onChange={(event, newValue) => {
                            setFormData((prev) => ({
                                ...prev,
                                mentoringTopics: newValue,
                            }));
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Mentorluk Konuları" margin="normal" fullWidth />
                        )}
                    />

                    {/* Mentorluk Tarzı */}
                    <TextField
                        select
                        label="Mentorluk Tarzı"
                        name="mentoringStyle"
                        value={formData.mentoringStyle}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        {mentoringStyleOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Ulaşılabilirlik Saatleri"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="İletişim Tercihleri"
                        name="communicationPreferences"
                        value={formData.communicationPreferences}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mentorluk Sıklığı"
                        name="mentoringFrequency"
                        value={formData.mentoringFrequency}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="LinkedIn"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="GitHub"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Kişisel Web Sitesi"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Eşleşmelere Açık mı? (true/false)"
                        name="openToMatching"
                        value={formData.openToMatching}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Şehir / Ülke"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Daha önce mentorluk yaptığı kişi sayısı"
                        name="previousMentees"
                        value={formData.previousMentees}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: "20px" }}>
                        Kaydet
                    </Button>
                </form>
            </Container>
        </div>
    );
};

export default MentorProfileEdit;



