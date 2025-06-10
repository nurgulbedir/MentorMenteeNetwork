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
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  GitHub,
  Language,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/* -------- Görsel ayarlar -------- */

const HERO_HEIGHT = 110; // ince şerit yüksekliği
const GRADIENT = "linear-gradient(135deg, #1976d2 0%, #673ab7 100%)";

export default function MenteeProfile() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  /* -------- Firestore verisi -------- */
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setData(snap.data());
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (loading)
    return (
      <Sidebar>
        <p>Yükleniyor…</p>
      </Sidebar>
    );
  if (!data)
    return (
      <Sidebar>
        <p>Profil verisi bulunamadı.</p>
      </Sidebar>
    );

  /* -------- Yardımcı label -------- */
  const Label = ({ children }) => (
    <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
      {children}
    </Typography>
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      {/* İnce gradyan bar */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: HERO_HEIGHT,
          background: GRADIENT,
          zIndex: -1,
        }}
      />

      {/* Profil kartı */}
      <Card
        sx={{
          flex: 1,
          mx: "auto",
          mt: 6,
          p: 4,
          maxWidth: 1000,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate("/mentee/profile/edit")}
          >
            Profili Düzenle
          </Button>
        </Stack>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* -------- Sol kolon -------- */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Avatar
              src={data.profilePhotoUrl || undefined}
              alt={data.fullName || "avatar"}
              sx={{ width: 140, height: 140, mx: "auto", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600}>
              {data.fullName}
            </Typography>
            <Typography>
              {data.department && `${data.department} / `}
              {data.school}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {data.studentStatus}
            </Typography>

            {/* Sosyal / Portfolio ikonları */}
            <Stack direction="row" spacing={1} justifyContent="center">
              {data.github && (
                <Tooltip title="GitHub">
                  <IconButton component="a" href={data.github} target="_blank">
                    <GitHub />
                  </IconButton>
                </Tooltip>
              )}
              {data.portfolioUrl && (
                <Tooltip title="Portfolyo">
                  <IconButton
                    component="a"
                    href={data.portfolioUrl}
                    target="_blank"
                  >
                    <Language />
                  </IconButton>
                </Tooltip>
              )}
              {data.cvUrl && (
                <Tooltip title="CV">
                  <IconButton component="a" href={data.cvUrl} target="_blank">
                    <LinkIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Grid>

          {/* -------- Sağ kolon -------- */}
          <Grid item xs={12} md={8}>
            <Label>Kısa Biyografi</Label>
            <Typography sx={{ mb: 2 }}>{data.bio || "—"}</Typography>

            <Divider sx={{ my: 1 }} />
            <Grid container spacing={1}>
              {[
                ["İlgi Alanları", "interestTags"],
                ["Bildikleri Teknolojiler", "knownTechnologies"],
                ["Geliştirmek İstediği Alanlar", "areasToImprove"],
                ["Mentorlukta Aradığı Konular", "mentorshipNeeds"],
              ].map(([title, field]) => (
                <Grid key={field} item xs={12}>
                  <Label>{title}</Label>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ mt: 0.5 }}
                  >
                    {data[field]?.length ? (
                      data[field].map((v) => (
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
                <Label>Mezuniyet Yılı</Label>
                <Typography>{data.graduationYear || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Kariyer Hedefi</Label>
                <Typography>{data.careerGoal || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Daha önce Mentorluk Aldı mı?</Label>
                <Typography>
                  {data.hasPreviousMentorship ? "Evet" : "Hayır"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Ulaşılabilirlik</Label>
                <Typography>{data.availability || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>İletişim Tercihi</Label>
                <Typography>{data.contactPreference || "—"}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Label>Lokasyon</Label>
                <Typography>{data.location || "—"}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
