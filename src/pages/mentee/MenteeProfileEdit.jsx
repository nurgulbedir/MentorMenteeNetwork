import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    OutlinedInput,
    Switch,
    FormControlLabel,
    Box,
} from "@mui/material";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

// Multi-select için menü ayarları
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 200,
            width: 250,
        },
    },
};

// İlgi alanları ve diğer tagler için örnek seçenekler
const interestOptions = [
    "Mobil Geliştirme",
    "Girişimcilik",
    "Yapay Zeka",
    "Web Geliştirme",
    "Veri Bilimi",
    "Siber Güvenlik",
];

const techOptions = ["Java", "Python", "HTML/CSS", "React", "Node.js"];

const mentorshipNeedsOptions = [
    "Teknik Bilgi",
    "Yönlendirme",
    "Motivasyon",
    "Kariyer Tavsiyesi",
];

const MenteeProfileEdit = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        profilePhotoUrl: "",
        studentStatus: "",
        school: "",
        department: "",
        graduationYear: "",
        interestTags: [],
        knownTechnologies: [],
        bio: "",
        mentorshipNeeds: [],
        projects: "",
        portfolioUrl: "",
        availability: "",
        contactPreference: "",
        areasToImprove: [],
        careerGoal: "",
        hasPreviousMentorship: false,
        isAvailableForMatch: true,
        location: "",
        preferredMentorFeatures: [],
    });

    // Veriyi Firestore'dan çek
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData({ ...formData, ...docSnap.data() });
                }
            }
        };

        fetchUserData();
        // eslint-disable-next-line
    }, [currentUser]);

    // Input değişikliklerini takip eden fonksiyon
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Multi-select için değişiklik
    const handleMultiSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Switch için değişiklik
    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    // Firestore'a kaydet
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "users", currentUser.uid);
            await updateDoc(docRef, formData);
            alert("Profil başarıyla güncellendi!");
            navigate("/mentee/profile");
        } catch (error) {
            console.error("Profil güncellenirken hata oluştu:", error);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "2rem" }}>
                <Typography variant="h4" gutterBottom>
                    Mentee Profilini Düzenle
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
                        name="profilePhotoUrl"
                        value={formData.profilePhotoUrl}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Öğrencilik Durumu</InputLabel>
                        <Select
                            name="studentStatus"
                            value={formData.studentStatus}
                            onChange={handleChange}
                            label="Öğrencilik Durumu"
                        >
                            <MenuItem value="Lise">Lise</MenuItem>
                            <MenuItem value="Lisans">Lisans</MenuItem>
                            <MenuItem value="Yüksek Lisans">Yüksek Lisans</MenuItem>
                            <MenuItem value="Mezun">Mezun</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Okul"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Bölüm"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Mezuniyet Yılı"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>İlgi Alanları</InputLabel>
                        <Select
                            multiple
                            name="interestTags"
                            value={formData.interestTags}
                            onChange={(e) =>
                                handleMultiSelectChange("interestTags", e.target.value)
                            }
                            input={<OutlinedInput label="İlgi Alanları" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {interestOptions.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Teknik Bilgi / Bildiği Diller</InputLabel>
                        <Select
                            multiple
                            name="knownTechnologies"
                            value={formData.knownTechnologies}
                            onChange={(e) =>
                                handleMultiSelectChange("knownTechnologies", e.target.value)
                            }
                            input={<OutlinedInput label="Teknik Bilgi / Bildiği Diller" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {techOptions.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Kendini Tanıtan Kısa Biyografi"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Mentorlukta Ne Arıyor?</InputLabel>
                        <Select
                            multiple
                            name="mentorshipNeeds"
                            value={formData.mentorshipNeeds}
                            onChange={(e) =>
                                handleMultiSelectChange("mentorshipNeeds", e.target.value)
                            }
                            input={<OutlinedInput label="Mentorlukta Ne Arıyor?" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {mentorshipNeedsOptions.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Projeler / Katıldığı Etkinlikler / Yarışmalar"
                        name="projects"
                        value={formData.projects}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                    />

                    <TextField
                        label="CV / Portfolyo Linki"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.hasPreviousMentorship}
                                onChange={handleSwitchChange}
                                name="hasPreviousMentorship"
                            />
                        }
                        label="Daha önce mentorluk aldı mı?"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isAvailableForMatch}
                                onChange={handleSwitchChange}
                                name="isAvailableForMatch"
                            />
                        }
                        label="Eşleşmelere açık mı?"
                    />

                    <TextField
                        label="Şehir / Zaman Dilimi"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Kaydet
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default MenteeProfileEdit;
