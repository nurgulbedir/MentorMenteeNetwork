// src/pages/auth/SignUp.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
    Grid,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Link as MuiLink,
    Paper
} from "@mui/material";
import { Link } from "react-router-dom";
import foto from "../assets/images/foto.jpg";


export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Mentee");
    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email,
                role,
                createdAt: new Date(),
            });
            console.log("Kayıt başarılı:", user);
        } catch (err) {
            console.error("Firebase Hatası:", err.code, err.message);
            setError(`Kayıt işlemi başarısız: ${err.message}`);
        }
    };

    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            {/* SOL GÖRSEL */}
            <Grid
                item
                xs={false}
                sm={6}
                md={6}
                sx={{
                    backgroundImage: `url(${foto})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* SAĞ FORM */}
            <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" gutterBottom>🧠 Mentor-Mentee Network</Typography>
                    <Typography variant="h6" gutterBottom>Kayıt Ol</Typography>

                    <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            label="E-posta"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Şifre"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Rol</InputLabel>
                            <Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <MenuItem value="Mentor">Mentor</MenuItem>
                                <MenuItem value="Mentee">Mentee</MenuItem>
                            </Select>
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2, mb: 1 }}>
                            Kayıt Ol
                        </Button>

                        <Typography sx={{ mt: 2, fontSize: 14 }}>
                            Zaten hesabın var mı?{" "}
                            <MuiLink component={Link} to="/login">
                                Giriş Yap
                            </MuiLink>
                        </Typography>

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}



