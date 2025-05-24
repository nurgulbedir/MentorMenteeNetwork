// src/pages/auth/SignUp.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

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

            // Firestore'a kullanıcı bilgilerini yaz
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email,
                role,
                createdAt: new Date(),
            });

            console.log("Kayıt başarılı:", user);
            // Yönlendirme yapılabilir
        } catch (err) {
            console.error(err);
            setError("Kayıt işlemi başarısız.");
        }
    };

    return (
        <div>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSignUp}>
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
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Mentor">Mentor</option>
                    <option value="Mentee">Mentee</option>
                </select>
                <button type="submit">Kayıt Ol</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}


