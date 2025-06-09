import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  LinkedIn,
  GitHub,
  Language,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HERO_HEIGHT = 110; // İnceltilmiş bar yüksekliği

export default function MentorProfile() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setProfileData(snap.data());
      setLoading(false);
    })();
  }, [currentUser]);

  if (loading)
    return (
      <Sidebar>
        <p>Yükleniyor…</p>
      </Sidebar>
    );

  /* ---------- Yardımcı label ---------- */
  const Label = ({ children }) => (
    <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
      {children}
    </Typography>
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      {/* İNCELTİLMİŞ GRADYAN BAR */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: HERO_HEIGHT,
          background: "linear-gradient(135deg, #1976d2 0%, #673ab7 100%)",
          zIndex: -1,
        }}
      />

      {/* PROFİL KARTI */}
      <Card
        sx={{
          flex: 1,
          mx: "auto",
          mt: 6, // bar inceldiği için 6 spacing (~48 px)
          p: 4,
          maxWidth: 1000,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate("/mentor/profile/edit")}
          >
            Profili Düzenle
          </Button>
        </Stack>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Sol kolon – avatar & başlık */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Avatar
              src={profileData.profilePhotoUrl || undefined}
              sx={{ width: 140, height: 140, mx: "auto", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600}>
              {profileData.fullName}
            </Typography>
            <Typography>
              {profileData.title}
              {profileData.organization && ` @ ${profileData.organization}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {profileData.mentorType}
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="center">
              {profileData.linkedin && (
                <Tooltip title="LinkedIn">
                  <IconButton
                    component="a"
                    href={profileData.linkedin}
                    target="_blank"
                  >
                    <LinkedIn />
                  </IconButton>
                </Tooltip>
              )}
              {profileData.github && (
                <Tooltip title="GitHub">
                  <IconButton
                    component="a"
                    href={profileData.github}
                    target="_blank"
                  >
                    <GitHub />
                  </IconButton>
                </Tooltip>
              )}
              {profileData.website && (
                <Tooltip title="Web">
                  <IconButton
                    component="a"
                    href={profileData.website}
                    target="_blank"
                  >
                    <Language />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Grid>

          {/* Sağ kolon – içerik */}
          <Grid item xs={12} md={8}>
            <Label>Hakkımda</Label>
            <Typography sx={{ mb: 2 }}>{profileData.bio || "—"}</Typography>

            <Divider sx={{ my: 1 }} />
            <Grid container spacing={1}>
              {[
                ["Uzmanlık Alanları", "expertiseAreas"],
                ["Teknik Yetkinlikler", "technicalSkills"],
              ].map(([title, field]) => (
                <Grid key={field} item xs={12}>
                  <Label>{title}</Label>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ mt: 0.5 }}
                  >
                    {profileData[field]?.length ? (
                      profileData[field].map((v) => (
                        <Chip key={v} label={v} color="primary" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Label>Eğitim</Label>
                <Typography>{profileData.education || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Deneyim</Label>
                <Typography>
                  {profileData.experienceYears
                    ? `${profileData.experienceYears} yıl`
                    : "—"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Mentorluk Tarzı</Label>
                <Typography>{profileData.mentoringStyle || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Mentorluk Sıklığı</Label>
                <Typography>{profileData.mentoringFrequency || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Ulaşılabilirlik</Label>
                <Typography>{profileData.availability || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>İletişim Tercihi</Label>
                <Typography>
                  {profileData.communicationPreferences || "—"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
