import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Mentee");

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Kayıt başarılı:", user);
            // Buraya Firestore'a kullanıcı rolü vs. yazılabilir
        } catch (error) {
            console.error("Hata:", error.message);
        }
    };

    return (
        <div>
            <h2>Kayıt Ol</h2>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" />
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="Mentor">Mentor</option>
                <option value="Mentee">Mentee</option>
            </select>
            <button onClick={handleSignUp}>Kayıt Ol</button>
        </div>
    );
}
