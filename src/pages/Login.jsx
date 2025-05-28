import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Link,
} from "@mui/material";
import { getDoc, doc } from "firebase/firestore";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                localStorage.setItem("role", role);
                navigate("/home");
            } else {
                setError("Kullanıcı rolü bulunamadı.");
            }
        } catch (err) {
            setError("Giriş başarısız. E-posta veya şifre hatalı.");
            console.error(err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 10 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Mentor-Mentee Network
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                    Giriş Yap
                </Typography>

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                        label="E-posta"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Şifre"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        GİRİŞ YAP
                    </Button>
                </Box>

                <Box mt={2} textAlign="center">
                    <Link href="/signup" underline="hover">
                        Hesabın yok mu? Kayıt Ol
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}
