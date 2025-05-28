import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // mentor veya mentee
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Kullanıcının rolüne göre Firestore'a kayıt
            await setDoc(doc(db, "users", user.uid), {
                email,
                role,
            });

            // Rolü localStorage'a kaydet
            localStorage.setItem("role", role);

            // Role göre yönlendirme
            if (role === "mentor") navigate("/mentor/profile");
            else if (role === "mentee") navigate("/mentee/profile");
        } catch (error) {
            console.error("Kayıt hatası:", error.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography component="h1" variant="h5">Kayıt Ol</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        required
                        fullWidth
                        label="E-posta"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Şifre"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControl fullWidth required margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Rol"
                        >
                            <MenuItem value="mentor">Mentor</MenuItem>
                            <MenuItem value="mentee">Mentee</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                        Kayıt Ol
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;



