// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Firebase Auth ile giriş
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firestore'dan kullanıcı rolünü al
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const role = userData.role;

                console.log("Rol:", role);

                // Role göre yönlendir
                if (role === "Mentor") {
                    navigate("/mentor/profile");
                } else if (role === "Mentee") {
                    navigate("/mentee/profile");
                } else {
                    setError("Geçersiz rol");
                }
            } else {
                setError("Kullanıcı verisi bulunamadı.");
            }
        } catch (err) {
            console.error(err);
            setError("Giriş başarısız. E-posta veya şifre hatalı.");
        }
    };

    return (
        <div>
            <h2>Giriş Yap</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Giriş Yap</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}

